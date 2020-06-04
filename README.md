
# rn-asdk-tinkoff

## Tinkoff Acquiring SDK for React-Native

#### Acquiring SDK позволяет интегрировать Интернет-Эквайрингу Тинькофф банка в мобильные приложения для платформ iOS/Android (React-Native).

### Возможности SDK

1. Прием платежей (в том числе рекуррентных)
2. Сохранение банковских карт клиента
3. Сканирование и распознавание карт с помощью камеры
4. Получение информации о клиенте и сохраненных картах
5. Управление сохраненными картами
6. Поддержка английского и своя локализация
7. Оплата с помощью ApplePay

### Требования

Для работы Tinkoff Acquiring SDK необходима версия React-Native 0.60 и выше.

### Установка

`$ yarn add rn-asdk-tinkoff --save`

### Настройка проекта

#### Для iOS

1. Откройке файл workspace из вашего проекта в Xcode
2. Переключить систему сборку в legacy: File -> Workspace Settings... -> Build System = Legacy Build System 👍

При ошибке "Directory not found for option '-L-L..." удалить "$(inherited)" из Library Search Paths

#### Для Android

1. 🙏
2. Открыть `android/app/src/main/java/[...]/MainActivity.java`
  - Добавить `import com.rnasdktinkoff.RNASDKTinkoffPackage;` в начало файла
  - Добавить `new RNASDKTinkoffPackage()` в список метода `getPackages()`
3. Добавить в `android/settings.gradle`:
  	```
		include ':rn-asdk-tinkoff'
		project(':rn-asdk-tinkoff').projectDir = new File(rootProject.projectDir, 	'../node_modules/rn-asdk-tinkoff/android')
		include ':core'
		project(':core').projectDir = new File(rootProject.projectDir, 	'../node_modules/rn-asdk-tinkoff/android/asdk/core')
		include ':ui'
		project(':ui').projectDir = new File(rootProject.projectDir, '../node_modules/rn-asdk-tinkoff/android/asdk/ui')
  	```
4. Добавить зависимость в блок `dependencies` в файл `android/app/build.gradle`:
  	```
      implementation project(':rn-asdk-tinkoff')
  	```
5. 🙏

### Как юзать

1. Подключаем ASDKTinkoff к проекту

```typescript
import ASDK from 'rn-asdk-tinkoff';

```
2. Создаем экземпляр класса

```typescript
const Tinkoff = new ASDK({
	test: true,
	terminal: "TestSDK",
	password: "12345678",
	publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqBiorLS9OrFPezixO5lSsF+HiZPFQWDO7x8gBJp4m86Wwz7ePNE8ZV4sUAZBqphdqSpXkybM4CJwxdj5R5q9+RHsb1dbMjThTXniwPpJdw4WKqG5/cLDrPGJY9NnPifBhA/MthASzoB+60+jCwkFmf8xEE9rZdoJUc2p9FL4wxKQPOuxCqL2iWOxAO8pxJBAxFojioVu422RWaQvoOMuZzhqUEpxA9T62lN8t3jj9QfHXaL4Ht8kRaa2JlaURtPJB5iBM+4pBDnqObNS5NFcXOxloZX4+M8zXaFh70jqWfiCzjyhaFg3rTPE2ClseOdS7DLwfB2kNP3K0GuPuLzsMwIDAQAB",
});

```

3. Открываем интерфейс оплаты

```typescript
	Tinkoff.makePayment({
		orderId: (Math.random() * 100000000000).toFixed(0),
		amount: 4500,
		title: "Покупка",
		description: "Розовые кеды Adadas"
	});

```

### Чего нужно доделать

1. расширение design объекта
  