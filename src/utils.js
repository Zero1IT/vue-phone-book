Array.prototype.max = function() {
  if (this.length === 0) return 0;
  return Math.max.apply(null, this);
};

/**
 * Fake async save data
 */
function asyncSave(key, data) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (!data) {
        rej("Invalid data");
      } else {
        let item = JSON.parse(localStorage.getItem(key)) || [];
        data.id = item.map(it => it.id).max() + 1;
        item.push(data.object || data);
        localStorage.setItem(key, JSON.stringify(item));
        res(data);
      }
    }, 500)
  });
}

/**
 * Fake async load all data
 */
function asyncLoadData(key) {
  return new Promise((res) => {
    setTimeout(() => {
      res(JSON.parse(localStorage.getItem(key)) || []);
    }, 1000);
  });
}

/**
 * Fake async delete data
 */
function asyncDeleteData(key, id) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const data = JSON.parse(localStorage.getItem(key));
      const initSize = data.length;
      const filtered = data.filter(it => it.id !== id);
      if (initSize === filtered.length) {
        rej("Data not found");
      } else {
        localStorage.setItem(key, JSON.stringify(filtered));
        res(id);
      }
    }, 500);
  });
}

/**
 * Fake async clear storage
 */
function asyncClearAll() {
  return new Promise(res => {
    setTimeout(() => {
      localStorage.clear();
      res(true);
    }, 500);
  });
}

export {
  asyncSave,
  asyncClearAll,
  asyncLoadData,
  asyncDeleteData
}