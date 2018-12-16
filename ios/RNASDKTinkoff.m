//
//  RNASDKTinkoff.m
//  RNASDKTinkoff
//
//  Created by Ilya Trikoz on 15.12.18.
//  Copyright © 2018 Ilya Trikoz. All rights reserved.
//

#import "RNASDKTinkoff.h"
#import <ASDKCore/ASDKCore.h>
#import <ASDKUI/ASDKUI.h>
#import "ASDKCardIOScanner.h";

@implementation RNASDKTinkoff

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
    
}

RCT_EXPORT_MODULE()

- (ASDKAcquiringSdk *)acquiringSdkWithTerminal: (NSString*)terminal password:(NSString*)password publicKey:(NSString*)publicKey test:(BOOL)test
{
    ASDKAcquiringSdk *acquiringSdk = [ASDKAcquiringSdk acquiringSdkWithTerminalKey:terminal
                                                                           payType:nil//@"O"//@"T"
                                                                          password:password
                                                               publicKeyDataSource:[[ASDKStringKeyCreator alloc] initWithPublicKeyString:publicKey]];
    [acquiringSdk setDebug:test];
    [acquiringSdk setTestDomain:test];
    [acquiringSdk setLogger:nil];
    
    return acquiringSdk;
}

/*
 * Проверка ApplePay
 */
RCT_EXPORT_METHOD(isApplePayAvailable:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if ([ASDKPaymentFormStarter isPayWithAppleAvailable]) {
        resolve(@TRUE);
    } else {
        resolve(@FALSE);
    }
}

/*
 * Оплата картой
 */
RCT_EXPORT_METHOD(payWithCard:(NSDictionary*) params
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    
    ASDKAcquiringSdk * acquiringSdk = [self
                                       acquiringSdkWithTerminal:[params objectForKey:@"terminal"]
                                       password:[params objectForKey:@"password"]
                                       publicKey:[params objectForKey:@"publicKey"]
                                       test:[params objectForKey:@"test"]];
    
    
    ASDKPaymentFormStarter * form = [ASDKPaymentFormStarter paymentFormStarterWithAcquiringSdk:acquiringSdk];
    
    
    NSDictionary * designParams = [params objectForKey:@"design"];
    
    if (designParams) {
        ASDKDesignConfiguration * design = form.designConfiguration;

        if ([designParams objectForKey:@"payButtonTitle"]) {
            [design setPayButtonTitle:[designParams objectForKey:@"payButtonTitle"]];
        }
    }
    
    if ([params objectForKey:@"enableCardScanner"]) {
        //Настройка сканнера карт
        form.cardScanner = [ASDKCardIOScanner scanner];
    }
    
    [form presentPaymentFormFromViewController:rootViewController
                                       orderId:[params objectForKey:@"orderId"]
                                        amount:[params objectForKey:@"amount"]
                                         title:[params objectForKey:@"title"]
                                   description:[params objectForKey:@"description"]
                                        cardId:[params objectForKey:@"cardId"]
                                         email:[params objectForKey:@"email"]
                                   customerKey:[params objectForKey:@"customerKey"]
                                     recurrent:[params objectForKey:@"recurrent"]
                                    makeCharge:[params objectForKey:@"makeCharge"]
                         additionalPaymentData:[params objectForKey:@"additionalPaymentData"]
                                   receiptData:[params objectForKey:@"receiptData"]
                                       success:^(ASDKPaymentInfo *paymentInfo) { resolve(paymentInfo); }
                                     cancelled:^{ resolve(NULL); }
                                         error:^(ASDKAcquringSdkError *error) { reject([NSString stringWithFormat:@"%ld", [error code]], [error errorMessage], error); }];
}

/*
 * Оплата ApplePay
 */
RCT_EXPORT_METHOD(payWithApplePay:(NSDictionary*) params
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    
    ASDKAcquiringSdk * acquiringSdk = [self
                                       acquiringSdkWithTerminal:[params objectForKey:@"terminal"]
                                       password:[params objectForKey:@"password"]
                                       publicKey:[params objectForKey:@"publicKey"]
                                       test:[params objectForKey:@"test"]];
    
    
    ASDKPaymentFormStarter * form = [ASDKPaymentFormStarter paymentFormStarterWithAcquiringSdk:acquiringSdk];
    
    [form payWithApplePayFromViewController:rootViewController
                                     amount:[params objectForKey:@"amount"]
                                    orderId:[params objectForKey:@"orderId"]
                                description:[params objectForKey:@"description"]
                                customerKey:[params objectForKey:@"customerKey"]
                                  sendEmail:[params objectForKey:@"sendEmail"]
                                      email:[params objectForKey:@"email"]
                            appleMerchantId:[params objectForKey:@"appleMerchantId"]
                            shippingMethods:nil
                            shippingContact:nil
                     shippingEditableFields:PKAddressFieldNone
                                  recurrent:[params objectForKey:@"recurrent"]
                      additionalPaymentData:[params objectForKey:@"additionalPaymentData"]
                                receiptData:[params objectForKey:@"receiptData"]
                                    success:^(ASDKPaymentInfo *paymentInfo) { resolve(paymentInfo); }
                                  cancelled:^{ resolve(NULL); }
                                      error:^(ASDKAcquringSdkError *error) { reject([NSString stringWithFormat:@"%ld", [error code]], [error errorMessage], error); }];
}

/*
 * Выполнение оплаты с paymentId и rebillId
 */
RCT_EXPORT_METHOD(chargePayment:(NSDictionary*) params
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    ASDKAcquiringSdk * acquiringSdk = [self
                                       acquiringSdkWithTerminal:[params objectForKey:@"terminal"]
                                       password:[params objectForKey:@"password"]
                                       publicKey:[params objectForKey:@"publicKey"]
                                       test:[params objectForKey:@"test"]];
    
    [acquiringSdk chargeWithPaymentId:[params objectForKey:@"paymentId"]
                             rebillId:[params objectForKey:@"rebillId"]
                              success:^(ASDKPaymentInfo *paymentInfo, ASDKPaymentStatus status) { resolve(paymentInfo); }
                              failure:^(ASDKAcquringSdkError *error) { reject([NSString stringWithFormat:@"%ld", (long)[error code]], [error errorMessage], error); }
     ];
}

/*
 * Получения списка карт
 */
RCT_EXPORT_METHOD(getCardList:(NSDictionary*) params
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    ASDKAcquiringSdk * acquiringSdk = [self
                                       acquiringSdkWithTerminal:[params objectForKey:@"terminal"]
                                       password:[params objectForKey:@"password"]
                                       publicKey:[params objectForKey:@"publicKey"]
                                       test:[params objectForKey:@"test"]];
    
    
    [acquiringSdk getCardListWithCustomerKey:[params objectForKey:@"customerKey"]
                                     success:^(ASDKGetCardListResponse *response) { resolve(response); }
                                     failure:^(ASDKAcquringSdkError *error) { reject([NSString stringWithFormat:@"%ld", (long)[error code]], [error errorMessage], error); }
     ];
}

/*
 * Удаление карты
 */
RCT_EXPORT_METHOD(removeCard:(NSDictionary*) params
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    ASDKAcquiringSdk * acquiringSdk = [self
                                       acquiringSdkWithTerminal:[params objectForKey:@"terminal"]
                                       password:[params objectForKey:@"password"]
                                       publicKey:[params objectForKey:@"publicKey"]
                                       test:[params objectForKey:@"test"]];
    
    [acquiringSdk removeCardWithCustomerKey:[params objectForKey:@"customerKey"]
                                     cardId:[params objectForKey:@"cardId"]
                                    success:^(ASDKRemoveCardResponse *response) { resolve(response); }
                                    failure:^(ASDKAcquringSdkError *error) { reject([NSString stringWithFormat:@"%ld", (long)[error code]], [error errorMessage], error); }
     ];
}

@end

