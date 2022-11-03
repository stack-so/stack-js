# Stack JS Client Library

[build-img]:https://github.com/ryansonshine/typescript-npm-package-template/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/ryansonshine/typescript-npm-package-template/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/typescript-npm-package-template
[downloads-url]:https://www.npmtrends.com/typescript-npm-package-template
[npm-img]:https://img.shields.io/npm/v/typescript-npm-package-template
[npm-url]:https://www.npmjs.com/package/typescript-npm-package-template
[issues-img]:https://img.shields.io/github/issues/ryansonshine/typescript-npm-package-template
[issues-url]:https://github.com/ryansonshine/typescript-npm-package-template/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/typescript-npm-package-template/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/typescript-npm-package-template
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/

## Install the Stack client library

```bash
npm install "@stack-so/stack"
```

## Usage

### Import the Stack Library

```ts
import stack from "stack-so";

stack.init(apiKey);
```

### Track an event from a wallet

```javascript
stack.track("CONNECT_WALLET", {
    actor: {
        type: "wallet",
        address: "0x375892Bb243D35E4c12e8a87b95e24F7F53d493E"
    }
});
```

### Track an interaction

```javascript
stack.track("LIKED_NFT", {
    actor: {
        type: "wallet",
        address: "0x375892Bb243D35E4c12e8a87b95e24F7F53d493E"
    },
    object: {
        type: "contract",
        address: "0x5180db8f5c931aae63c74266b211f580155ecac8",
        id: 3
    };
})
```

### Enrich your information with metadata

```javascript
stack.track("VIEWED_COLLECTION", {
    actor: {
        type: "wallet",
        address: "0x375892Bb243D35E4c12e8a87b95e24F7F53d493E"
    },
    object: {
        type: "contract",
        address: "0x5180db8f5c931aae63c74266b211f580155ecac8",
        id: 3,
        extras: {
            device: "mobile",
            source: "homepage
        }
    };
})
```

### Specify related transactions

```javascript
stack.track("INITIATED_NFT_PURCHASE", {
    actor: {
        type: "wallet",
        address: "0x375892Bb243D35E4c12e8a87b95e24F7F53d493E"
    },
    object: {
        type: "contract",
        address: "0x5180db8f5c931aae63c74266b211f580155ecac8",
        id: 3,
        transactionHash: "0x5d0f516d4d526de5434dfe05a2fb6e93708e2f1d8910999059b46ae12b9331c3",
        extras: {
            device: "mobile",
            source: "homepage"
        }
    };
})
```