/**
 * React-native ASDKTinkoff sample
 * Created by Ilya Trikoz on 15.12.18.
 * Copyright © 2018 Ilya Trikoz. All rights reserved.
 */

import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import ASDKTinkoff from 'rn-asdk-tinkoff';

const Tinkoff = new ASDKTinkoff({
	test: true,
	terminal: "TestSDK",
	password: "12345678",
	publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqBiorLS9OrFPezixO5lSsF+HiZPFQWDO7x8gBJp4m86Wwz7ePNE8ZV4sUAZBqphdqSpXkybM4CJwxdj5R5q9+RHsb1dbMjThTXniwPpJdw4WKqG5/cLDrPGJY9NnPifBhA/MthASzoB+60+jCwkFmf8xEE9rZdoJUc2p9FL4wxKQPOuxCqL2iWOxAO8pxJBAxFojioVu422RWaQvoOMuZzhqUEpxA9T62lN8t3jj9QfHXaL4Ht8kRaa2JlaURtPJB5iBM+4pBDnqObNS5NFcXOxloZX4+M8zXaFh70jqWfiCzjyhaFg3rTPE2ClseOdS7DLwfB2kNP3K0GuPuLzsMwIDAQAB",
});

export default class App extends React.Component {
	render() {
		return (
			<View style={{ padding: 40, justifyContent: "center" }}>
				<Button onPress={async () => {
					try {
						const res = await Tinkoff.makePayment({
							orderId: (Math.random() * 100000000000).toFixed(0),
							amount: 100,
							title: "Покупка",
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
				}} title="Открыть окно оплаты" />
			</View>
		)
	}
}