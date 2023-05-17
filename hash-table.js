const sha256 = require("js-sha256");

class KeyValuePair {
	constructor(key, value) {
		this.key = key;
		this.value = value;
		this.next = null;
	}
}

class HashTable {

	constructor(numBuckets = 4) {
		this.data = new Array(numBuckets).fill(null);
		this.capacity = this.data.length;
		this.count = 0;
	}

	hash(key) {
		const hash = sha256(key).slice(0, 8);
		return parseInt(hash, 16);
	}

	hashMod(key) {
		return this.hash(key) % this.capacity;
	}

	insertNoCollisions(key, value) {
		const index = this.hashMod(key);

		// throw error on collision
		if (this.data[index]) {
			throw Error("hash collision or same key/value pair already exists!");
		}

		this.data[index] = new KeyValuePair(key, value);
		this.count++;
	}

	insertWithHashCollisions(key, value) {
		const index = this.hashMod(key),
			newNode = new KeyValuePair(key, value);

		let el = this.data[index];

		while (el) {
			if (el.key === newNode.key) {
				el.value = value;
				return;
			}
			el = el.next;
		}

		newNode.next = this.data[index];
		this.data[index] = newNode;
		this.count++;
	}

	insert(key, value) {
		const index = this.hashMod(key),
			el = this.data[index];

		if (!el) {
			this.insertNoCollisions(key, value);
		} else {
			this.insertWithHashCollisions(key, value);
		}
	}
}


let hashTable = new HashTable(2);

// hashTable.insert("key-1", "val-1");
// hashTable.insert("key-2", "val-2");
// hashTable.insert("key-3", "val-3");
// hashTable.insert("key-1", "val-100000");

// console.log(hashTable)
// console.log(hashTable.data[0]);
// console.log(hashTable.count);

// console.log(hashTable.data[0].key);
// console.log(hashTable.data[0].value);

// console.log(hashTable.data[1].key)
// console.log(hashTable.data[1].value)

// console.log(hashTable.data[0].next.key);
// console.log(hashTable.data[0].next.value);

module.exports = HashTable;
