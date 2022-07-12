const _ = require('lodash');
const { Op } = require('sequelize');
const db = require('../db/db');

const extendedSearchTypes = {
  in: Op.in,
  lte: Op.lte,
  gte: Op.gte,
  contains: Op.contains,
  or: Op.or,
  and: Op.and,
};

class SearchBuilder {
  /**
   * @param {{
      pagination: {
        perPage: number;
        page: number;
        limit?: number;
        offset?: number;
      };
      sort: {
        sortBy: string;
        sortDirection: "straight" | "reverse";
      };
      filter: object;
      include: Array<{
        model: string,
        as: string,
        attributes: Array<string>
      }
   * }} options
   */
  constructor(options) {
    this.pagination = options.pagination;
    this.sort = options.sort;
    this.filter = options.filter;
    this.include = options.include;

    this.orders = {
      straight: 'ASC',
      reverse: 'DESC',
    };
  }

  /**
   * @returns {{
        limit: number;
        offset: number;
   * }}
   */
  getPagination() {
    return {
      limit: +_.get(this.pagination, 'limit') || null,
      offset: +_.get(this.pagination, 'offset') || null,
    };
  }

  /**
   * @returns {{
      orders: Array<string[]>;
   * }}
   */
  getSort() {
    if (!this.sort) {
      return {};
    }

    const { sortBy, sortDirection } = this.sort;

    return {
      order: [
        [sortBy || 'id', this.orders[sortDirection] || this.orders.straight],
        ['id', this.orders.straight],
      ],
    };
  }

  /**
   * @returns {{
      where: object;
   * }}
   */
  getFilter() {
    if (!this.filter) {
      return {};
    }

    const where = this.parseFilterItem(this.filter);

    return {
      where,
    };
  }

  parseFilterItem(value, key) {
    const parsedKey = (key || '').split(/\[|\]/);
    const searchingMethod = extendedSearchTypes[parsedKey[1]];

    if (searchingMethod) {
      const newValue = { [searchingMethod]: this.parseFilterItem(value) };

      if (!parsedKey[0]) {
        return newValue;
      }

      return {
        [parsedKey[0]]: newValue,
      };
    }

    if (Array.isArray(value)) {
      return value.map((i) => this.parseFilterItem(i));
    }

    if (value && typeof value === 'object') {
      if (value.type && value.type[0] === '$') {
        return this.parseCustomSearchType(value, key);
      }

      let obj = {};
      Object.keys(value).forEach((key) => {
        obj = {
          ...obj,
          ...this.parseFilterItem(value[key], key),
        };
      });

      return obj;
    }
    if (!key) { return value; }

    return { [key]: value };
  }

  // eslint-disable-next-line class-methods-use-this
  parseCustomSearchType(filter, key) {
    switch (filter.type) {
      case '$or':
        return { [key]: { [Op.or]: filter.value } };

      case '$in': {
        let operators = { [Op.ne]: null };

        if (filter.value.length) {
          operators = { [Op.in]: filter.value };
        }

        return { [key]: operators };
      }

      case '$search':
        return {
          [Op.or]: filter.fields.map((field) => ({
            [field]: { [Op.iLike]: `%${filter.value}%` },
          })),
        };

      default:
        break;
    }
  }

  getInclude(db) {
    if (!_.isArray(this.include) || _.isEmpty(db)) {
      return {};
    }

    // TODO nested include
    const include = this.include.map((includeQr) => ({
      ...includeQr,
      model: db[includeQr.model],
    }));

    return {
      include,
    };
  }

  /**
   * @returns {{
      limit: number;
      offset: number;
      orders: Array<string[]>;
      where: object;
   * }}
   */
  buildQuery() {
    return {
      ...this.getPagination(),
      ...this.getSort(),
      ...this.getFilter(),
      ...this.getInclude(db),
    };
  }
}

module.exports = SearchBuilder;
