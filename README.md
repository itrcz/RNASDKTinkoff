
# rn-asdk-tinkoff
## Интерфейс взаимодействия с эквайрингом банка Тинькофф для React-Native

### Установка

`$ yarn add rn-asdk-tinkoff --save`

### Автоматическая настройка проекта

`$ react-native link rn-asdk-tinkoff`

### Ручная настройка проекта

#### Для iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `rn-asdk-tinkoff` and add `RNASDKTinkoff.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNASDKTinkoff.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Для Android

1. Открыть `android/app/src/main/java/[...]/MainActivity.java`
  - Добавить `import com.reactlibrary.fonov.RNASDKTinkoffPackage;` в начало файла
  - Добавить `new RNASDKTinkoffPackage()` в список метода `getPackages()`
2. Добавить в `android/settings.gradle`:
  	```
  	include ':rn-asdk-tinkoff'
  	project(':rn-asdk-tinkoff').projectDir = new File(rootProject.projectDir, 	'../node_modules/rn-asdk-tinkoff/android')
  	```
3. Добавить зависимость в блок `dependencies` в файл `android/app/build.gradle`:
  	```
      compile project(':rn-asdk-tinkoff')
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

1. Не написан модуль под Andrid (пока только iOS)
2. Не реализовано сканирование карт
  