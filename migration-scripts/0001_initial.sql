CREATE TABLE `tb_jamquery` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `content` varchar(2000) NOT NULL,
  `type` char(6) NOT NULL DEFAULT 'url',
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tb_tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1296 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tb_jamquery_tag_relation` (
  `jamquery_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  UNIQUE KEY `jamquery_id` (`jamquery_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `tb_jamquery_tag_relation_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tb_tag` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `tb_jamquery_tag_relation_ibfk_3` FOREIGN KEY (`jamquery_id`) REFERENCES `tb_jamquery` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
