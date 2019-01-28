
# rn-asdk-tinkoff
## Интерфейс взаимодействия с эквайрингом банка Тинькофф для React-Native

### Установка

`$ yarn add rn-asdk-tinkoff --save`

### Настройка проекта

#### Для iOS

1. В настройках проекта в XCode, найдите `Libraries` ➜ `Add Files to...`
2. Добавте `RNASDKTinkoff.xcodeproj` из `./node_modules/rn-asdk-tinkoff` 
3. Затем добавте `libRNASDKTinkoff.a, ASDKCore.framework, ASDKUI.framework` в разделе `Build Phases` ➜ `Link Binary With Libraries`

#### Для Android
#### Пока не работает по вердо - дальше можно не читать ;)

1. Открыть `android/app/src/main/java/[...]/MainActivity.java`
  - Добавить `import com.rnasdktinkoff.RNASDKTinkoffPackage;` в начало файла
  - Добавить `new RNASDKTinkoffPackage()` в список метода `getPackages()`
2. Добавить в `android/settings.gradle`:
  	```
		include ':rn-asdk-tinkoff'
		project(':rn-asdk-tinkoff').projectDir = new File(rootProject.projectDir, 	'../node_modules/rn-asdk-tinkoff/android')
		include ':core'
		project(':core').projectDir = new File(rootProject.projectDir, 	'../node_modules/rn-asdk-tinkoff/android/asdk/core')
		include ':ui'
		project(':ui').projectDir = new File(rootProject.projectDir, '../node_modules/rn-asdk-tinkoff/android/asdk/ui')
  	```
3. Добавить зависимость в блок `dependencies` в файл `android/app/build.gradle`:
  	```
      implementation project(':rn-asdk-tinkoff')
  	```


### Как юзать

1. Подключаем ASDKTinkoff к проекту

```typescript
import ASDKTinkoff from 'rn-asdk-tinkoff';

```
2. Создаем экземпляр класса `ASDKTinkoff`

```typescript
const Tinkoff = new ASDKTinkoff({
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
		description: "Розовые кеды ADADAS"
	});

```

### Чаво

Модуль написан на Typescript, все функции описаны, поэтому описания в README больше не будет, сорян ;)

### Чего нужно доделать

1. Добавить shops и receipts в ведро
2. googlepay
3. куча всего для ведра не готово
2. доставка и контакты для ApplePay
4. расширение design объекта
  