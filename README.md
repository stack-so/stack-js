# Stack JS Client Library

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

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