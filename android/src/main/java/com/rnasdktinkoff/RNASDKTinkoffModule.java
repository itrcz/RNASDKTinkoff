
package com.rnasdktinkoff;

import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.Promise;

import java.util.ArrayList;
import java.util.HashMap;

import ru.tinkoff.acquiring.sdk.Money;
import ru.tinkoff.acquiring.sdk.PayFormActivity;
import ru.tinkoff.acquiring.sdk.Shop;
import ru.tinkoff.acquiring.sdk.Journal;


public class RNASDKTinkoffModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNASDKTinkoffModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
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
   * Оплата картой
   */
  @ReactMethod
  public void payWithCard(ReadableMap params, Promise promise) {
    int REQUEST_CODE_PAYMENT = 0;

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
            email = "",
            customerKey = "";

    Boolean recurrent = false;
    Boolean makeCharge = false;
    Integer amount = 0;

      if (params.hasKey("terminal")) terminal = params.getString("terminal");
      if (params.hasKey("password")) password = params.getString("password");
      if (params.hasKey("publicKey")) publicKey = params.getString("publicKey");
      if (params.hasKey("orderId")) orderId = params.getString("orderId");
      if (params.hasKey("title")) title = params.getString("title");
      if (params.hasKey("description")) description = params.getString("description");
      if (params.hasKey("cardId")) cardId = params.getString("cardId");
      if (params.hasKey("email")) email = params.getString("email");
      if (params.hasKey("recurrent")) recurrent = params.getBoolean("recurrent");
      if (params.hasKey("makeCharge")) makeCharge = params.getBoolean("makeCharge");
      if (params.hasKey("amount")) amount = params.getInt("amount");


      HashMap<String, String> additionalPaymentDataHashMap = new HashMap<>();

    if (params.hasKey("additionalPaymentData")) {
        ReadableMap additionalPaymentData = params.getMap("additionalPaymentData");
        ReadableMapKeySetIterator iterator = additionalPaymentData.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            additionalPaymentDataHashMap.put(key, additionalPaymentData.getString(key));
        }
    }

    ArrayList<Shop> shops;

//      ShopCode: number | string,
//              Amount: number
//      Fee: number
//      Name: string
//
//      if (params.hasKey("shops")) {
//          params.getArray("shops").toArrayList()
//      }
      //TODO: shops
      
    PayFormActivity
            .init(terminal, password, publicKey) // данные продавца
            .prepare(
                    orderId,
                    Money.ofCoins(amount),
                    title,
                    description,
                    cardId,
                    email,
                    recurrent,
                    true
            )
            .setCustomerKey(customerKey)
            .setChargeMode(makeCharge)
            .setData(additionalPaymentDataHashMap)
            //TODO: Receipt
            .setShops(shops ? shops : null, null)
            .startActivityForResult(this.getCurrentActivity(), REQUEST_CODE_PAYMENT);


    promise.resolve(params.getString("terminal"));
  }
}