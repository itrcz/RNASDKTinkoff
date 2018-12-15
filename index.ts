import { NativeModules } from 'react-native';

interface IMakePayment {
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
}

interface ICard {
    /**
     * идентификатор покупателя в системе Продавца
     */
    customerKey: string
    /**
     * идентификатор карты
     */
    cardId: number
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

type IPRemoveCard = ICard;



export default class ASDKTinkoff {

    protected terminal: string;
    protected password: string;
    protected publicKey: string;
    protected test: boolean;

    constructor(param: { terminal: string, password: string, publicKey: string, test: boolean }) {
        this.terminal = param.terminal;
        this.password = param.password;
        this.publicKey = param.publicKey;
        this.test = param.test;
    }

    /**
     * Открыть окно оплаты
     */
    makePayment(params: IMakePayment): Promise<IPaymentInfo | null> {
        return NativeModules.RNASDKTinkoff.makePayment({
            terminal: this.terminal,
            password: this.password,
            publicKey: this.publicKey,
            test: this.test,

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
            receiptData: params.receiptData
        })
    }

    /**
     * Выполнить плату по реккурентному платежу
     * @warning FUNC NOT TESTED
     */
    chargePayment(params: IPChargePayment): Promise<IPaymentInfo | null> {
        return NativeModules.RNASDKTinkoff.chargePayment({
            terminal: this.terminal,
            password: this.password,
            publicKey: this.publicKey,
            test: this.test,

            paymentId: params.paymentId,
            rebillId: params.rebillId,
        })
    }

    /**
     * Список подключенных карт
     */
    getCardList(params: IPGetCardList): Promise<ICard[]> {
        return NativeModules.RNASDKTinkoff.getCardList({
            terminal: this.terminal,
            password: this.password,
            publicKey: this.publicKey,
            test: this.test,

            customerKey: params.customerKey,
        })
    }

    /**
     * Список подключенных карт
     */
    removeCard(params: IPRemoveCard): Promise<ICard> {
        return NativeModules.RNASDKTinkoff.removeCard({
            terminal: this.terminal,
            password: this.password,
            publicKey: this.publicKey,
            test: this.test,

            customerKey: params.customerKey,
            cardId: params.cardId,
        })
    }
}