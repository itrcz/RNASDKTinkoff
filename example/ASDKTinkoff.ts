/**
 * React-native ASDKTinkoff
 * Created by Ilya Trikoz on 15.12.18.
 * Copyright © 2018 Ilya Trikoz. All rights reserved.
 */

import { NativeModules } from 'react-native';

interface IPayWithCard {
    /**
     * номер заказа в системе Продавца
    */
    orderId: string
    /**
     * сумма
     */
    amount: number
    /**
     * заголовок товара
     */
    title: string
    /**
     * описание товара
     */
    description: string
    /**
     * идентификатор карты в системе Банка
     */
    cardId?: string
    /**
     * адрес почты покупателя
     */
    email?: string
    /**
     * идентификатор покупателя в системе Продавца
     */
    customerKey?: string
    /**
     * сделать платеж родительским
     */
    recurrent?: boolean
    /**
     * сделать charge
     */
    makeCharge?: boolean
    /**
     * дополнительные параметры (могут быть пустыми)
     */
    additionalPaymentData?: object
    /**
     * данные чека (могут быть пустыми)
     */
    receiptData?: object
    /**
     * Для маркетплейс
     */
    shops?: IShop[]
}

interface IPayWithApplePay {
    /**
     * сумма
     */
    amount: number
    /**
 * номер заказа в системе Продавца
*/
    orderId: string
    /**
     * описание товара
     */
    description: string
    /**
     * идентификатор покупателя в системе Продавца
     */
    customerKey?: string
    /**
     * Отправить квитанцию об оплате
     */
    sendEmail?: boolean
    /**
     * адрес почты покупателя
     */
    email?: string

    // /**
    //  * Идентификатор мерчант ApplePay
    //  */
    // appleMerchantId: string

    shippingMethods?: null
    shippingContact?: null
    shippingEditableFields?: null

    /**
     * сделать платеж родительским
     */
    recurrent?: boolean
    /**
     * дополнительные параметры (могут быть пустыми)
     */
    additionalPaymentData?: object
    /**
     * данные чека (могут быть пустыми)
     */
    receiptData?: object
    /**
     * Для маркетплейс
     */
    shops?: IShop[]
}

interface IShop {
    ShopCode: number | string,
    Amount: number
    Fee: number
    Name: string
}

interface ICard {
    CardId: string
    CardType: string
    ExpDate: string
    Pan: string
    RebillId: string
    Status: string
}

interface IPaymentInfo {
    /**
     * Идентификатор платежа
     */
    paymentId: string
    /**
     * Идентификатор заказа
     */
    orderId: string
    /**
     * Статус платежа
     */
    status: string
    /**
     * Сумма платежа
     */
    amount: number
}

interface IPChargePayment {
    /**
     * Номер платежа
    */
    paymentId: string,
    /**
     * ID реккурента
     */
    rebillId: number,
}

interface IPGetCardList {
    /**
     * идентификатор покупателя в системе Продавца
     */
    customerKey: string
}

type IPRemoveCard = {
    customerKey: string
    cardId: string
};

interface ASDKDesignConfiguration {
    /**
     * Текст на кнопке оплаты
     */
    payButtonTitle?: string
}

interface ASDKTinkoffParams {
    terminal: string
    password: string
    publicKey: string
    test: boolean
    appleMerchantId: string
    design?: ASDKDesignConfiguration
    enableCardScanner?: boolean
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
     * Засетить текст на кнопку оплаты
     */
    set payButtonTitle(title: string) {
        this.params.design!.payButtonTitle = title;
    }

    /**
     * Доступность ApplePay
     */
    async isApplePayAvailable(): Promise<boolean> {
        return NativeModules.RNASDKTinkoff.isApplePayAvailable();
    }

    /**
     * Открыть окно оплаты
     */
    payWithCard(params: IPayWithCard): Promise<IPaymentInfo | null> {
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
     * Открыть окно ApplePay
     */
    payWithApplePay(params: IPayWithApplePay): Promise<IPaymentInfo | null> {
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
     * Выполнить плату по реккурентному платежу
     * @warning FUNC NOT TESTED
     */
    chargePayment(params: IPChargePayment): Promise<IPaymentInfo | null> {
        return NativeModules.RNASDKTinkoff.chargePayment({
            ...this.params,

            paymentId: params.paymentId,
            rebillId: params.rebillId,
        })
    }

    /**
     * Список подключенных карт
     */
    getCardList(params: IPGetCardList): Promise<ICard[]> {
        return NativeModules.RNASDKTinkoff.getCardList({
            ...this.params,

            customerKey: params.customerKey,
        })
    }

    /**
     * Список подключенных карт
     */
    removeCard(params: IPRemoveCard): Promise<ICard> {
        return NativeModules.RNASDKTinkoff.removeCard({
            ...this.params,

            customerKey: params.customerKey,
            cardId: params.cardId,
        })
    }
}

export default ASDKTinkoff;