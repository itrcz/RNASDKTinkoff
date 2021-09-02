
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
import ru.tinkoff.acquiring.sdk.Receipt;
import ru.tinkoff.acquiring.sdk.Tax;
import ru.tinkoff.acquiring.sdk.Taxation;
import ru.tinkoff.acquiring.sdk.Item;

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
     * for iOS only
     */
    @ReactMethod
    public void isApplePayAvailable(Promise promise) {
        promise.resolve(false);
    }

    /*
     * GooglePay
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
    public void payWithCard(ReadableMap params, Promise promise) throws Exception {

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
        Double amount = 0.00;

        ReadableMap receiptData = params.getMap("receiptData");

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
        if (params.hasKey("amount")) amount = params.getDouble("amount");

        /**
         * Форма оплаты
         */
        PayFormStarter payForm = PayFormActivity.init(terminal, password, publicKey);

        payForm.prepare(
                orderId,
                Money.ofRubles(amount),
                title,
                description,
                cardId,
                email,
                recurrent,
                true
        );

        payForm.setReceipt(createReceipt(receiptData.getArray("Items"), receiptData.getString("Email"), receiptData.getString("Taxation")));

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

     private Receipt createReceipt(ReadableArray jsItems, String email, String taxationName) throws Exception {
        Taxation taxation;
        switch (taxationName) {
          case "osn":
            taxation = Taxation.OSN;
            break;
          case "usn_income":
            taxation = Taxation.USN_INCOME;
            break;
          case "usn_income_outcome":
            taxation = Taxation.USN_INCOME_OUTCOME;
            break;
          case "envd":
            taxation = Taxation.ENVD;
            break;
          case "esn":
            taxation = Taxation.ESN;
            break;
          case "patent":
            taxation = Taxation.PATENT;
            break;
          default:
            throw new Exception("Incorrect taxation");
        }

        Item[] items = new Item[jsItems.size()];
        for (int index = 0; index < jsItems.size(); index++) {
          ReadableMap i = jsItems.getMap(index);
          Tax tax;

          switch (i.getString("Tax")) {
            case "none":
              tax = Tax.NONE;
              break;
            case "vat0":
              tax = Tax.VAT_0;
              break;
            case "vat10":
              tax = Tax.VAT_10;
              break;
            case "vat18":
              tax = Tax.VAT_18;
              break;
            case "vat110":
              tax = Tax.VAT_110;
              break;
            case "vat118":
              tax = Tax.VAT_118;
              break;
            case "vat20":
              tax = Tax.VAT_110;
              break;
            case "vat120":
              tax = Tax.VAT_118;
              break;
            default:
              throw new Exception("Incorrect item tax");
          }

          items[index] = new Item(
            i.getString("Name"),
            (long)i.getDouble("Price"),
            i.getDouble("Quantity"),
            (long)i.getDouble("Amount"),
            tax
          );
        }

        return new Receipt(items, email, taxation);
      }

    @Override
    public void onActivityResult(Activity activity,int requestCode, int resultCode, Intent data) {
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

    @Override
    public void onNewIntent(Intent data) {

    }
}
