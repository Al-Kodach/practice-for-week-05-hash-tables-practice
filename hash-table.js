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
    let hash = sha256(key).slice(0, 8);

    hash = parseInt(hash, 16);

    return hash;
  }

  hashMod(key) {
    let idx = this.hash(key) % this.data.length;
    return idx;
  }

  insertNoCollisions(key, value) {
    let idx = this.hashMod(key);
    let newData = new KeyValuePair(key, value);

    if (this.data[idx]) {
      throw Error("hash collision or same key/value pair already exists!");
    }

    this.data[idx] = newData;
    this.count++;
  }

  insertWithHashCollisions(key, value) {
    let idx = this.hashMod(key);
    let newData = new KeyValuePair(key, value);

    let oldData = this.data[idx];

    newData.next = oldData;
    this.data[idx] = newData;

    this.count++;
  }

  _getLinkKeyValuePair(data) {
    return [data.key, data.value];
  }

  insert(key, value) {
    // bucket index
    let idx = this.hashMod(key),
      // create a new data object
      newData = new KeyValuePair(key, value),
      // data at current index
      oldData = this.data[idx];

    // if no data occpied, we place newData
    if (!oldData) {
      this.data[idx] = newData;
      this.count++;
      return;
    }

    // if occupied, we check the key and value
    // we throw error for duplicate key and value
    // if same key but different value we update value
    if (oldData.key === key && oldData.value === value) {
      throw Error("hash collision or same key/value pair already exists!");
    } else if (oldData.key === key && oldData.value !== value) {
      this.data[idx].value = value;
      return;
    }

    // if occupied, we check the for linked data before we link the new data
    if (oldData.next) {
      if (oldData.next.key === key && oldData.next.value === value) {
        throw Error("hash collision or same key/value pair already exists!");
      } else if (oldData.next.key === key && oldData.next.value !== value) {
        // if same key but different value
        oldData.next.value = value;
        return;
      }

      // if no update needed or duplicate detected, we link old-data to new data
      newData.next = oldData;
      this.data[idx] = newData;
    }

    newData.next = oldData;
    this.data[idx] = newData;
    this.count++;
  }
}


let hashTable = new HashTable(2);

hashTable.insert("key-1", "val-1");
hashTable.insert("key-2", "val-2");
hashTable.insert("key-3", "val-3");
hashTable.insert("key-1", "val-100000");

console.log(hashTable)
console.log(hashTable.data[0]);
console.log(hashTable.count);

console.log(hashTable.data[0].key);
console.log(hashTable.data[0].value);

console.log(hashTable.data[1].key)
console.log(hashTable.data[1].value)

console.log(hashTable.data[0].next.key);
console.log(hashTable.data[0].next.value);

module.exports = HashTable;
