
package com.rnasdktinkoff;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.Promise;

import java.util.ArrayList;
import java.util.HashMap;

import ru.tinkoff.acquiring.sdk.Money;
import ru.tinkoff.acquiring.sdk.PayFormActivity;
import ru.tinkoff.acquiring.sdk.PayFormStarter;
import ru.tinkoff.acquiring.sdk.Shop;
import ru.tinkoff.acquiring.sdk.Journal;


public class RNASDKTinkoffModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    static final int  REQUEST_CODE_PAYMENT = 0;

    Promise promise;

    private final ReactApplicationContext reactContext;

    public RNASDKTinkoffModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "RNASDKTinkoff";
    }

    /*
     * Проверка ApplePay
     */
    @ReactMethod
    public void isApplePayAvailable(Promise promise) {
        /**
         * конечно же false...
         */
        promise.resolve(false);
    }

    /*
     * Проверка GooglePay
     */
    @ReactMethod
    public void payWithGooglePay(ReadableMap params, Promise promise) {

        this.promise = promise;

        Journal.setDebug(params.getBoolean("test"));
        Journal.setDeveloperMode(params.getBoolean("test"));


        promise.resolve(false);
    }

    /*
     * Оплата картой
     */
    @ReactMethod
    public void payWithCard(ReadableMap params, Promise promise) {

        this.promise = promise;

        Journal.setDebug(params.getBoolean("test"));
        Journal.setDeveloperMode(params.getBoolean("test"));

        String
                terminal = "",
                password = "",
                publicKey = "",
                orderId = "",
                title = "",
                description = "",
                cardId = "",
                email = "";

        Boolean recurrent = false;
        Integer amount = 0;

        /**
         * Основные параметры
         */
        if (params.hasKey("terminal")) terminal = params.getString("terminal");
        if (params.hasKey("password")) password = params.getString("password");
        if (params.hasKey("publicKey")) publicKey = params.getString("publicKey");
        if (params.hasKey("orderId")) orderId = params.getString("orderId");
        if (params.hasKey("title")) title = params.getString("title");
        if (params.hasKey("description")) description = params.getString("description");
        if (params.hasKey("cardId")) cardId = params.getString("cardId");
        if (params.hasKey("email")) email = params.getString("email");
        if (params.hasKey("recurrent")) recurrent = params.getBoolean("recurrent");
        if (params.hasKey("amount")) amount = params.getInt("amount");

        /**
         * Форма оплаты
         */
        PayFormStarter payForm = PayFormActivity.init(terminal, password, publicKey);

        payForm.prepare(
                orderId,
                Money.ofCoins(amount),
                title,
                description,
                cardId,
                email,
                recurrent,
                true
        );


        /**
         * Ключ клиента
         */
        if (params.hasKey("customerKey")) {
            payForm.setCustomerKey(params.getString("customerKey"));
        }

        /**
         * makeCharge
         */
        if (params.hasKey("makeCharge")) {
            payForm.setChargeMode(params.getBoolean("makeCharge"));
        }

        /**
         * Дополнительные параметры
         */
        if (params.hasKey("additionalPaymentData")) {
            HashMap<String, String> data = new HashMap<>();

            ReadableMap additionalPaymentData = params.getMap("additionalPaymentData");
            ReadableMapKeySetIterator iterator = additionalPaymentData.keySetIterator();

            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                data.put(key, additionalPaymentData.getString(key));
            }
            payForm.setData(data);
        }

        /**
         * Для маркетплейс
         */
        if (params.hasKey("shops")) {
            ArrayList<Shop> shops = new ArrayList();
//
//            for (Object object : params.getArray("shops")) {
//                HashMap<String, String> shopHashString = ((HashMap<String, String>) object);
//                HashMap<String, Double> shopHashDouble = ((HashMap<String, Double>) object);
//
//                String ShopCode = shopHashString.get("ShopCode");
//                String ShopName = shopHashString.get("ShopName");
//                long ShopAmount = shopHashDouble.get("Amount").longValue();
//                String ShopFee = shopHashString.get("Fee");
//
//                shops.add(
//                        new Shop(ShopCode, ShopName, ShopAmount, ShopFee)
//                );
//            }
//            // TODO: Receipts
            payForm.setShops(shops, null);
        }


        /**
         * Для фискализации
         */
        // TODO: Receipt

        /**
         * Открыть активити
         */
        payForm.startActivityForResult(this.getCurrentActivity(), RNASDKTinkoffModule.REQUEST_CODE_PAYMENT);

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == RNASDKTinkoffModule.REQUEST_CODE_PAYMENT) {
            if (resultCode == -1) {
                this.promise.resolve(true);
            }
            if (resultCode == 0) {
                this.promise.resolve(null);
            }
            if (resultCode == 500) {
                this.promise.reject("Ошибка выполнения платежа");
            }
        }
    }
}