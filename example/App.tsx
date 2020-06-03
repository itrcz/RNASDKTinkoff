/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, Alert, View, Button } from 'react-native';
import ASDK from 'rn-asdk-tinkoff'

const Tinkoff = new ASDK({
  terminal: "TestSDK",
  password: "12345678",
  test: true,
  publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqBiorLS9OrFPezixO5lSsF+HiZPFQWDO7x8gBJp4m86Wwz7ePNE8ZV4sUAZBqphdqSpXkybM4CJwxdj5R5q9+RHsb1dbMjThTXniwPpJdw4WKqG5/cLDrPGJY9NnPifBhA/MthASzoB+60+jCwkFmf8xEE9rZdoJUc2p9FL4wxKQPOuxCqL2iWOxAO8pxJBAxFojioVu422RWaQvoOMuZzhqUEpxA9T62lN8t3jj9QfHXaL4Ht8kRaa2JlaURtPJB5iBM+4pBDnqObNS5NFcXOxloZX4+M8zXaFh70jqWfiCzjyhaFg3rTPE2ClseOdS7DLwfB2kNP3K0GuPuLzsMwIDAQAB",
  appleMerchantId: "merchant.tcsbank.ApplePayTestMerchantId",
  enableCardScanner: true
});

const App = () => {

  const [applePayAvailable, setApplePayAvailable] = useState(false)

  useEffect(() => {

    const checkApplePay = async () => {
      setApplePayAvailable(
        await Tinkoff.isApplePayAvailable()
      )
    }

    checkApplePay()

  }, [])

  const payCard = async () => {
    try {
      const res = await Tinkoff.payWithCard({
        orderId: (Math.random() * 100000000000).toFixed(0),
        amount: 1000,
        title: "Покупка",
        description: "Описание покупки",
        // for marketplace only
        // shops: [{
        // 	ShopCode: "100",
        // 	Amount: 1000,
        // 	Fee: 100,
        // 	Name: '',
        // }]
      });
      if (res) {
        Alert.alert("Оплата", "Успех!");
      } else {
        Alert.alert("Оплата", "Отмена")
      }
    } catch (error) {
      Alert.alert("Ошибка оплаты", error.message);
    }
  }

  const payApplePay = async () => {
    try {
      const res = await Tinkoff.payWithApplePay({
        orderId: (Math.random() * 100000000000).toFixed(0),
        amount: 100,
        description: "Описание покупки"
      });
      if (res) {
        Alert.alert("Оплата", "Успех!");
      } else {
        Alert.alert("Оплата", "Отмена")
      }
    } catch (error) {
      Alert.alert("Ошибка оплаты", error.message);
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={{ padding: 40, justifyContent: "center" }}>
          <Button onPress={payCard} title="Оплатить картой" />
          {applePayAvailable && (
            <Button onPress={payApplePay} title="Pay" />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
