import { NativeModules } from 'react-native';

const { RNASDKTinkoff } = NativeModules;

interface ASDKPaymentInfo {

}

interface ASDKAcquringSdkError {

}

interface ASDKRNTinkoff {
    testString: (testString: string) => Promise<String>
    pay: (
        /**
         * номер заказа в системе Продавца
         */
        orderId: string,
        /**
         * сумма
         */
        amount: number,
        /**
         * заголовок товара
         */
        title: string,
        /**
         * описание товара
         */
        description: string,
        /**
         * идентификатор карты в системе Банка
         */
        cardId?: string,
        /**
         * адрес почты покупателя
         */
        email?: string,
        /**
         * идентификатор покупателя в системе Продавца
         */
        customerKey?: string,
        /**
         * сделать платеж родительским
         */
        recurrent?: boolean,
        /**
         * сделать charge
         */
        makeCharge?: boolean,
        /**
         * дополнительные параметры (могут быть пустыми)
         */
        additionalPaymentData?: object,
        /**
         * данные чека (могут быть пустыми)
         */
        receiptData?: object,
        /**
         * вызывается в случае успешного платежа
         */
        success?: (paymentInfo: ASDKPaymentInfo) => void,
        /**
         * вызывается при отмене операции
         */
        cancelled?: () => void,
        /**
         * вызывается в случае ошибки
         */
        error?: (error: ASDKAcquringSdkError) => void
    ) => void
}

export default RNASDKTinkoff as ASDKRNTinkoff;
