-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 15, 2020 at 08:01 AM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs_crud`
--

-- --------------------------------------------------------

--
-- Table structure for table `music`
--

DROP TABLE IF EXISTS `music`;
CREATE TABLE IF NOT EXISTS `music` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `featured_img` varchar(250) NOT NULL,
  `title` varchar(250) NOT NULL,
  `band_name` varchar(250) NOT NULL,
  `audio` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `music`
--

INSERT INTO `music` (`id`, `featured_img`, `title`, `band_name`, `audio`) VALUES
(1, 'featured_img-1596786310846.jpg', 'Only One', 'Yellowcard', 'audio-1596786310857.mp3'),
(2, 'featured_img-1596791250577.jpg', 'Secrete Valentine', 'We The Kings', 'audio-1596791250589.mp3'),
(3, 'featured_img-1596797627716.jpg', 'It Ends Tonight', 'The All-American Rejects', 'audio-1596797627725.mp3'),
(4, 'featured_img-1596797945731.jpg', 'Not Done Yet', 'SOJA', 'audio-1596797945739.mp3'),
(5, 'featured_img-1596798520836.jpg', 'Kapag Lasing Malambing', 'Mayonnaise', 'audio-1596798520855.mp3'),
(6, 'featured_img-1596799212854.jpg', 'Better Days', 'Franco', 'audio-1596799212861.mp3'),
(7, 'featured_img-1596814448279.jpg', 'Scar Tissue', 'Red Hot Chili Peppers', 'audio-1596814448288.mp3');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
