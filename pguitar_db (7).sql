-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 17, 2026 at 11:55 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pguitar_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Classic', 'classic'),
(2, 'Acoustic', 'acoustic'),
(3, 'Electric', 'electric'),
(4, 'Phụ kiện', 'phu-kien');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `note` text,
  `payment_method` varchar(50) DEFAULT 'COD',
  `total_money` decimal(10,0) NOT NULL,
  `status` varchar(50) DEFAULT 'Đang xử lý',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `fullname`, `phone`, `address`, `note`, `payment_method`, `total_money`, `status`, `created_at`) VALUES
(1, 4, 'Lê Ngọc Phong', '2345234', '26', 'che ten sp', 'COD', 1, 'Đang xử lý', '2025-11-21 01:42:31'),
(2, 7, 'phong', '151551515', 'uio', '', 'COD', 356, 'Đã hủy', '2025-12-19 13:09:24'),
(3, 4, 'Khách Test Biểu Đồ', '0909123456', 'Hồ Chí Minh', 'Test doanh thu', 'COD', 5000000, 'Đã giao', '2025-12-20 12:48:33'),
(4, 9, 'ye', '6456', 'hrh', '', 'COD', 1243, 'Đang giao hàng', '2025-12-20 12:50:23'),
(5, 4, 'Lê Ngọc Phong', 'gưe', '26', '', 'COD', 356, 'Đã giao', '2025-12-26 08:32:33'),
(6, 11, 'Lê Ngọc Phong', '0334090425', '26', '', 'COD', 1435555, 'Đã hủy', '2026-03-21 19:10:49'),
(7, 10, 'Lê Ngọc Phong', '2345234', '26', 'jhgfd', 'COD', 3, 'Đã giao', '2026-03-28 12:57:55'),
(8, 4, 'aaaa', '1111', 'aaa', '', 'COD', 1435555, 'Đã giao', '2026-04-11 14:08:35'),
(9, 10, 'Phong Lê Ngọc', '5343', 'gfgghj', '', 'COD', 567, 'Đã giao', '2026-04-17 10:11:22'),
(10, 10, 'Lê Ngọc Phong', '65', '26', '', 'COD', 1435555, 'Đã giao', '2026-04-17 10:32:38'),
(11, 10, 'Phong Lê Ngọc', '34222', 'dg', '', 'COD', 7177775, 'Đã giao', '2026-04-17 10:36:48'),
(12, 4, 'admin', '23456', 'hcm', '', 'COD', 355000000, 'Đã giao', '2026-04-17 10:45:15'),
(13, 10, 'Lê Ngọc Phong', '0334090425', '26', '', 'COD', 3500000, 'Đã giao', '2026-04-17 11:05:18'),
(14, 10, 'Lê Ngọc Phong', '432', '26', '', 'COD', 3325000, 'Đã giao', '2026-04-17 11:15:31'),
(15, 4, 'Phong Lê Ngọc', '56789', 'ghj', '', 'COD', 30175000, 'Đã giao', '2026-04-17 11:20:10'),
(16, 10, 'Phong Lê Ngọc', '987', 'ghj', '', 'COD', 31950510, 'Đã giao', '2026-04-17 11:22:43'),
(17, 10, '6543', '08', 'rew', '', 'COD', 127800000, 'Đã giao', '2026-04-17 11:24:01'),
(18, 10, 'Lê Ngọc Phong', '0334090425', '26', 'e', 'MoMo', 2975000, 'Đang xử lý', '2026-04-18 12:22:27'),
(19, 10, 'Phong Lê Ngọc', '2345234', 'r', '', 'Chuyển khoản', 30175000, 'Đang xử lý', '2026-04-18 12:25:37'),
(20, 10, 'Lê Ngọc Phong', '65', '26', '', 'MoMo', 1220221, 'Đang xử lý', '2026-04-18 12:26:17'),
(21, 10, 'Lê Ngọc Phong', '2345234', '26', 'r', 'MoMo', 2975000, 'Đang xử lý', '2026-04-18 12:31:09'),
(22, 10, 'Lê Ngọc Phong', '65', '26', '', 'VNPAY', 5950000, 'Đã giao', '2026-04-18 12:32:12'),
(23, 10, 'Lê Ngọc Phong', '2345234', '26', '', 'VNPAY', 2975000, 'Đang giao hàng', '2026-04-18 12:32:44'),
(24, 4, 'y', '67', 'ty', '', 'MoMo', 212500, 'Đã hủy', '2026-04-18 14:19:14'),
(25, 4, '54', '43', 'ds', '', 'COD', 2975000, 'Đang xử lý', '2026-04-18 14:24:58');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE IF NOT EXISTS `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `price`, `quantity`) VALUES
(1, 1, 7, 123, 1),
(2, 1, 4, 1, 1),
(3, 2, 8, 356, 1),
(4, 3, 10, 5000000, 1),
(5, 4, 9, 1243, 1),
(6, 5, 8, 356, 1),
(7, 6, 11, 1435555, 1),
(8, 7, 4, 1, 3),
(9, 8, 11, 1435555, 1),
(10, 9, 12, 567, 1),
(11, 10, 11, 1435555, 1),
(12, 11, 11, 1435555, 5),
(13, 12, 4, 35500000, 10),
(14, 13, 13, 3500000, 1),
(15, 14, 13, 3500000, 1),
(16, 15, 4, 35500000, 1),
(17, 16, 4, 35500000, 1),
(18, 16, 12, 567, 1),
(19, 17, 4, 35500000, 4),
(20, 18, 13, 3500000, 1),
(21, 19, 4, 35500000, 1),
(22, 20, 11, 1435555, 1),
(23, 21, 13, 3500000, 1),
(24, 22, 13, 3500000, 2),
(25, 23, 13, 3500000, 1),
(26, 24, 20, 250000, 1),
(27, 25, 14, 3500000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `description` text,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `description`, `image`, `created_at`) VALUES
(16, 'Đàn Guitar Elictric chính hãng', 5300000, 'Electric', 'Đàn Guitar', '/images/69e32c0bed444-fender-player-stratocaster-mn-blk.jpg', '2026-04-18 07:00:27'),
(15, 'Đàn Guitar Acoustic chính hãng', 2500000, 'Acoustic', 'Đàn Guitar', '/images/69e32bd91b8e7-fender-cd-60s-lh-dreadnought-acoustic-guitar-left-handed-p1077-7485_image.jpg', '2026-04-18 06:59:37'),
(14, 'Đàn Guitar Classic chính hãng', 3500000, 'Classic', 'Đàn guitar', '/images/69e32b9647a64-cordoba-acoustic-guitars-classical-cordoba-c5-natural-u5712866301-30855953776775_2000x.jpg', '2026-04-18 06:58:30'),
(17, 'Capoguitar', 95000, 'Phụ kiện', 'Phụ kiện', '/images/69e32c3fb2326-Capo Guitar.jpg', '2026-04-18 07:01:19'),
(18, 'Dây đàn', 70000, 'Phụ kiện', 'Dây đàn', '/images/69e32c5b15492-Dây đàn Elixir Phosphor Bronze.jpg', '2026-04-18 07:01:47'),
(19, 'Tuner', 150000, 'Phụ kiện', '', '/images/69e32c734aa17-Máy lên dây (Tuner) ET-33.png', '2026-04-18 07:02:11'),
(20, 'Bao đàn guitar 3 lớp', 250000, 'Classic', '', '/images/69e32c8edf7c8-Bao đàn Guitar 3 lớp.jpg', '2026-04-18 07:02:38');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_path`) VALUES
(1, 13, '/images/69e1b09a68f75-f310-435789_l.jpg'),
(2, 13, '/images/69e1b0a6e86fb-fender-cd-60s-lh-dreadnought-acoustic-guitar-left-handed-p1077-7485_image.jpg'),
(3, 14, '/images/69e32b9647a64-cordoba-acoustic-guitars-classical-cordoba-c5-natural-u5712866301-30855953776775_2000x.jpg'),
(4, 14, '/images/69e32ba627bd6-OIP (1).jpg'),
(5, 14, '/images/69e32baf30383-Guitar Classic Martinez MC-58S.jpg'),
(6, 15, '/images/69e32bd91b8e7-fender-cd-60s-lh-dreadnought-acoustic-guitar-left-handed-p1077-7485_image.jpg'),
(7, 15, '/images/69e32be390c30-f310-435789_l.jpg'),
(8, 16, '/images/69e32c0bed444-fender-player-stratocaster-mn-blk.jpg'),
(9, 16, '/images/69e32c14b6249-GIBSON_2018_LES_PAUL_STUDIO_T_VINTAGE_SUNBURST_LPST18VSCH1_south-coast-music-111.jpg'),
(10, 16, '/images/69e32c20bc810-preview_1.jpg'),
(11, 17, '/images/69e32c3fb2326-Capo Guitar.jpg'),
(12, 18, '/images/69e32c5b15492-Dây đàn Elixir Phosphor Bronze.jpg'),
(13, 19, '/images/69e32c734aa17-Máy lên dây (Tuner) ET-33.png'),
(14, 20, '/images/69e32c8edf7c8-Bao đàn Guitar 3 lớp.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `fullname`, `email`, `phone`, `address`) VALUES
(4, 'admin', '$2y$10$V.cdWpEcg7guh7wAFhMP5eh1m/Fv0uVfpc4hWzxiL6RE4q.IG2PM.', 'admin', '2025-11-07 17:17:17', NULL, NULL, NULL, NULL),
(10, 'user', '$2y$10$yKbIHS8SPzgtjjEd9BHt0udDRHWgYzowidKiILARIKeNCGgL48xze', 'user', '2025-12-20 05:30:29', 'Lê Ngọc Phong', 'phong@gmail.com', '0334090425', 'P4.Q8,TPHCM');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
