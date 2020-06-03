/**
 * React-native ASDKTinkoff
 * Created by Ilya Trikoz on 15.12.18.
 * Copyright © 2018 Ilya Trikoz. All rights reserved.
 */

import { NativeModules } from 'react-native';

interface PayWithCardParams {
    /**
     * Order identifier of mercahat
     */
    orderId: string
    /**
     * Amount to pay
     */
    amount: number
    /**
     * Title of payment
     */
    title: string
    /**
     * Product description
     */
    description: string
    /**
     * Card identifier
     */
    cardId: string
    /**
     * Email address of customer
     */
    email?: string
    /**
     * Unique customer identifier
     */
    customerKey?: string
    /**
     * Make payment recurring
     */
    recurrent?: boolean
    /**
     * Charge with no questions
     */
    makeCharge?: boolean
    /**
     * Advanced payment data
     * any object, can be empty
     */
    additionalPaymentData?: object
    /**
     * Receipt DATA
     * https://oplata.tinkoff.ru for object type
     */
    receiptData?: object
    /**
     * For marketplace only
     */
    shops?: MarketplaceShop[]
}

interface PayWithApplePayParams {
    /**
     * Amount to pay
     */
    amount: number
    /**
     * Order identifier of mercahat
     */
    orderId: string
    /**
     * Product description
     */
    description: string
    /**
     * Unique customer identifier
     */
    customerKey?: string
    /**
     * Allow send receipt to customer
     */
    sendEmail?: boolean
    /**
     * Email address of customer
     */
    email?: string

    // /**
    //  * ???
    //  */
    // appleMerchantId: string

    /**
     * Shipping methods for ApplePay
     */
    shippingMethods?: null
    /**
     * Shipping contact for ApplePay
     */
    shippingContact?: null
    /**
     * Shipping field for ApplePay
     */
    shippingEditableFields?: null
    /**
     * Make payment recurring
     */
    recurrent?: boolean
    /**
     * Advanced payment data
     * any object, can be empty
     */
    additionalPaymentData?: object
    /**
     * Receipt DATA
     * https://oplata.tinkoff.ru for object type
     */
    receiptData?: object
    /**
     * Shops array for marketplace
     */
    shops?: MarketplaceShop[]
}

interface MarketplaceShop {
    /**
     * Marketplace shop code
     */
    ShopCode: number | string
    /**
     * Amount to pay
     */
    Amount: number
    /**
     * Amount fee to charge
     */
    Fee: number
    /**
     * Payment description
     */
    Name: string
}

interface PaymentCard {
    /**
     * Card identifier
     */
    CardId: string
    /**
     * Payment card type
     */
    CardType: string
    /**
     * Expiration date of payment card
     */
    ExpDate: string
    /**
     * Card number (masked)
     */
    Pan: string
    /**
     * Recurring rebuild identifier
     */
    RebillId: string
    /**
     * Status of payment
     */
    Status: string
}

interface PaymentInfo {
    /**
     * Payment identidier
     */
    paymentId: string
    /**
     * Order identifier
     */
    orderId: string
    /**
     * Status of payment
     */
    status: string
    /**
     * Amount to pay
     */
    amount: number
}

interface ChargePaymentParams {
    /**
     * Payment identidier
    */
    paymentId: string
    /**
     * Recurring rebuild identifier
     */
    rebillId: number
}

interface GetCardListParams {
    /**
     * Unique client identifier
     */
    customerKey: string
}

type RemoveCardParams = {
    /**
     * Unique client identifier
     */
    customerKey: string
    /**
     * Card identifier
     */
    cardId: string
};

interface ASDKDesignConfiguration {
    /**
     * Label of pay button
     */
    payButtonTitle?: string
}

interface ASDKTinkoffParams {
    /**
     * Terminal identifier
     */
    terminal: string
    /**
     * Terminal password
     */
    password: string
    /**
     * Public key for terminal
     */
    publicKey: string
    /**
     * Set true for testing
     */
    test: boolean
    /**
     * ApplePay merchant identifier
     */
    appleMerchantId: string
    /**
     * Enable card scanner at payment form
     */
    enableCardScanner?: boolean
    /**
     * Custom desing configuration
     */
    design?: ASDKDesignConfiguration
}

interface ASDKTinkoff {
    params: ASDKTinkoffParams
}

class ASDKTinkoff {

    constructor(params: ASDKTinkoffParams) {
        this.params = params;
        if (!this.params.design) {
            this.params.design = {};
        }
    }

    /**
     * Set pay button label
     */
    set payButtonTitle(title: string) {
        this.params.design!.payButtonTitle = title;
    }

    /**
     * Check ApplePay available
     */
    async isApplePayAvailable(): Promise<boolean> {
        return NativeModules.RNASDKTinkoff.isApplePayAvailable();
    }

    /**
     * Open modal view with payment form
     */
    payWithCard(params: PayWithCardParams): Promise<PaymentInfo | null> {
        return NativeModules.RNASDKTinkoff.payWithCard({
            ...this.params,

            orderId: params.orderId,
            amount: params.amount,
            title: params.title,
            description: params.description,
            cardId: params.cardId,
            email: params.email,
            customerKey: params.customerKey,
            recurrent: params.recurrent,
            makeCharge: params.makeCharge,
            additionalPaymentData: params.additionalPaymentData,
            receiptData: params.receiptData,
            shops: params.shops
        })
    }

    /**
     * Open ApplePay view
     */
    payWithApplePay(params: PayWithApplePayParams): Promise<PaymentInfo | null> {
        return NativeModules.RNASDKTinkoff.payWithApplePay({
            ...this.params,

            orderId: params.orderId,
            amount: params.amount,
            description: params.description,
            email: params.email,
            sendEmail: params.sendEmail,
            customerKey: params.customerKey,
            recurrent: params.recurrent,
            additionalPaymentData: params.additionalPaymentData,
            receiptData: params.receiptData,
            shops: params.shops
        })
    }

    /**
     * Charge recurring payment
     * @warning NOT TESTED
     */
    chargePayment(params: ChargePaymentParams): Promise<PaymentInfo | null> {
        return NativeModules.RNASDKTinkoff.chargePayment({
            ...this.params,

            paymentId: params.paymentId,
            rebillId: params.rebillId,
        })
    }

    /**
     * Get list of saved payment cards
     */
    getCardList(params: GetCardListParams): Promise<PaymentCard[]> {
        return NativeModules.RNASDKTinkoff.getCardList({
            ...this.params,

            customerKey: params.customerKey,
        })
    }

    /**
     * Remove payment card
     */
    removeCard(params: RemoveCardParams): Promise<PaymentCard> {
        return NativeModules.RNASDKTinkoff.removeCard({
            ...this.params,

            customerKey: params.customerKey,
            cardId: params.cardId,
        })
    }
}

export default ASDKTinkoff;