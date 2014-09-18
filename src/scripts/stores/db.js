/**
 * Database Class
 * @constructor
 */
var db = {

  /**
   * Internal pointer for database object
   * @type {Object}
   * @public
   */
  conn: null,

  /**
   * Initialize database connection
   * @param {String} databaseName The name of the database
   * @param {String} displayName The display name of the database
   * @param {Number} estimatedSize The size of the database
   * @return {Void}
   * @public
   */
  init: function(databaseName, displayName, estimatedSize) {
    if (db.conn === null) {
      db.conn = window.openDatabase(databaseName, '', displayName, estimatedSize);
    }
  }
};