
-- categories table
CREATE TABLE IF NOT EXISTS categories (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` TEXT(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



-- products table
CREATE TABLE IF NOT EXISTS products (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` TEXT(255) NOT NULL,
  `price` INTEGER,
  `description` TEXT(1000) NULL,
  `image` TEXT(100) NULL,
  `category_id` INTEGER NOT NULL,
  `is_deleted` INTEGER DEFAULT 0,
  `is_active` INTEGER DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  FOREIGN KEY (`category_id`) REFERENCES categories(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- insert into categories
INSERT INTO categories (name) VALUES ('Electronics');
INSERT INTO categories (name) VALUES ('Clothes');
INSERT INTO categories (name) VALUES ('Food');
INSERT INTO categories (name) VALUES ('Books');
INSERT INTO categories (name) VALUES ('Others');

