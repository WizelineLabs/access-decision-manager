export default (seedData = []) => {
  let rows = seedData;

  return {
    create(item) {
      const itemWithId = {
        id: Date.now(),
        ...item,
      };

      rows.push(itemWithId);

      return itemWithId;
    },
    delete(id) {
      rows = rows.filter((row) => row.id != id);

      return rows;
    },
    getAll() {
      return rows;
    },
    getOne(id) {
      const item = rows.find((row) => row.id == id);

      if (!item) {
        throw new Error(`Could not find item with id: ${id}`);
      }

      return item;
    },
    update(id, item) {
      const index = rows.findIndex((row) => row.id == id);

      if (index === undefined) {
        throw new Error(`Could not find item with id: ${id}`);
      }

      rows[index] = {
        id: rows[index].id,
        ...item
      }

      return rows[index]
    }
  };
};
