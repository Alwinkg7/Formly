-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 30, 2025 at 06:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `feedback_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--

CREATE TABLE `forms` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forms`
--

INSERT INTO `forms` (`id`, `user_id`, `title`, `description`, `created_at`) VALUES
(1, 0, 'Student Feedback Form', 'Collects feedback about the last class session.', '2025-07-12 18:59:41'),
(7, 0, 'Trip Form', '', '2025-07-26 10:53:00'),
(8, 0, 'Exam Registration Form', '', '2025-07-26 14:21:53'),
(10, 0, 'test 1', '', '2025-07-26 21:37:06'),
(11, 0, 'test 2', '', '2025-07-26 21:52:51'),
(12, 0, 'test 3', '', '2025-07-27 13:22:17'),
(13, 0, 'Untitled form', '', '2025-07-30 15:42:39'),
(14, 2, 'Untitled form 2', '', '2025-07-30 17:27:28'),
(15, 2, 'test 1', '', '2025-07-30 17:31:13'),
(16, 3, 'test uniq', '', '2025-07-30 17:44:45'),
(17, 3, 'Stundent details', '', '2025-07-30 17:52:32'),
(18, 3, 'Stundent details', '', '2025-07-30 17:54:23'),
(19, 2, 'trendy', '', '2025-07-30 19:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `form_options`
--

CREATE TABLE `form_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_text` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_options`
--

INSERT INTO `form_options` (`id`, `question_id`, `option_text`) VALUES
(1, 1, 'Yes'),
(2, 1, 'No'),
(3, 1, 'Maybe'),
(4, 3, 'Topic A'),
(5, 3, 'Topic B'),
(6, 3, 'Topic C'),
(7, 5, 'Yes'),
(8, 5, 'No'),
(9, 5, 'Not Sure'),
(10, 21, 'US'),
(11, 21, 'UK'),
(12, 21, 'Australia'),
(13, 25, '2022'),
(14, 25, '2023'),
(15, 25, '2024'),
(16, 25, '2025'),
(17, 30, 'Option 1'),
(18, 30, 'Option 2'),
(19, 36, '2025'),
(20, 36, '2024');

-- --------------------------------------------------------

--
-- Table structure for table `form_questions`
--

CREATE TABLE `form_questions` (
  `id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `question_text` varchar(500) DEFAULT NULL,
  `question_type` enum('text','multiple_choice','rating','boolean') NOT NULL,
  `min_value` int(11) DEFAULT 1,
  `max_value` int(11) DEFAULT 5,
  `options` text DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT 0,
  `question_order` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_questions`
--

INSERT INTO `form_questions` (`id`, `form_id`, `question_text`, `question_type`, `min_value`, `max_value`, `options`, `is_required`, `question_order`) VALUES
(1, 1, 'Was the class helpful?', 'multiple_choice', 1, 5, NULL, 0, NULL),
(2, 1, 'Any suggestions for improvement?', 'text', 1, 5, NULL, 0, NULL),
(3, 1, 'Which topics were most useful?', 'multiple_choice', 1, 5, NULL, 0, NULL),
(4, 1, 'Rate the overall experience (1-5)', 'rating', 1, 5, NULL, 0, NULL),
(5, 1, 'Would you recommend this class?', 'multiple_choice', 1, 5, NULL, 0, NULL),
(25, 8, 'Year', 'multiple_choice', 1, 5, '[\"2022\",\"2023\",\"2024\",\"2025\"]', 0, 2),
(24, 8, 'Name', 'text', 1, 5, NULL, 0, 1),
(23, 7, 'Cahnces of approval', 'rating', 1, 5, NULL, 0, 4),
(22, 7, 'Things to carry', 'boolean', 1, 5, '[\"Bag\",\"Tent\",\"Camera\"]', 0, 3),
(21, 7, 'Where to go ', 'multiple_choice', 1, 5, '[\"US\",\"UK\",\"Australia\"]', 0, 2),
(20, 7, 'Name', 'text', 1, 5, NULL, 1, 1),
(27, 10, 'name', 'text', 1, 5, NULL, 0, 1),
(28, 12, 'number', 'text', 1, 5, NULL, 0, 1),
(29, 14, 'Number', 'text', 1, 5, NULL, 0, 1),
(30, 15, 'Radio Buttons', 'multiple_choice', 1, 5, '[\"Option 1\",\"Option 2\"]', 0, 1),
(31, 16, 'place', 'text', 1, 5, NULL, 0, 1),
(32, 17, 'Name', 'text', 1, 5, NULL, 0, 1),
(33, 17, 'Number', 'text', 1, 5, NULL, 0, 2),
(34, 18, 'Name', 'text', 1, 5, NULL, 0, 1),
(35, 18, 'Number', 'text', 1, 5, NULL, 0, 2),
(36, 19, 'year', 'multiple_choice', 1, 5, '[\"2025\",\"2024\"]', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `form_respondents`
--

CREATE TABLE `form_respondents` (
  `id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `submission_date` datetime DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_respondents`
--

INSERT INTO `form_respondents` (`id`, `form_id`, `name`, `email`, `submission_date`) VALUES
(101, 1, 'Alice Johnson', 'alice1@example.com', '2025-05-30 09:00:00'),
(102, 1, 'Bob Smith', 'bob2@example.com', '2025-05-30 09:05:00'),
(103, 1, 'Charlie Brown', 'charlie3@example.com', '2025-05-30 09:10:00'),
(104, 1, 'Diana Prince', 'diana4@example.com', '2025-05-30 09:15:00'),
(105, 1, 'Ethan Hunt', 'ethan5@example.com', '2025-05-30 09:20:00'),
(106, 1, 'Fiona Glenanne', 'fiona6@example.com', '2025-05-30 09:25:00'),
(107, 1, 'George Miller', 'george7@example.com', '2025-05-30 09:30:00'),
(108, 1, 'Hannah Scott', 'hannah8@example.com', '2025-05-30 09:35:00'),
(109, 1, 'Ian Wright', 'ian9@example.com', '2025-05-30 09:40:00'),
(110, 1, 'Julia Stone', 'julia10@example.com', '2025-05-30 09:45:00'),
(111, 1, 'Kevin Adams', 'kevin11@example.com', '2025-05-30 09:50:00'),
(112, 1, 'Laura Bell', 'laura12@example.com', '2025-05-30 09:55:00'),
(113, 1, 'Michael King', 'michael13@example.com', '2025-05-30 10:00:00'),
(114, 1, 'Nina Lane', 'nina14@example.com', '2025-05-30 10:05:00'),
(115, 1, 'Oscar Reed', 'oscar15@example.com', '2025-05-30 10:10:00'),
(116, 1, 'Paula Quinn', 'paula16@example.com', '2025-05-30 10:15:00'),
(117, 1, 'Quinn Rivers', 'quinn17@example.com', '2025-05-30 10:20:00'),
(118, 1, 'Rachel Snow', 'rachel18@example.com', '2025-05-30 10:25:00'),
(119, 1, 'Steve Tyler', 'steve19@example.com', '2025-05-30 10:30:00'),
(120, 1, 'Tina West', 'tina20@example.com', '2025-05-30 10:35:00'),
(121, 7, '', '', '2025-07-26 11:01:14'),
(122, 7, '', '', '2025-07-26 11:55:20'),
(123, 7, '', '', '2025-07-26 11:56:15'),
(124, 7, 'Rajiv', '', '2025-07-26 12:18:16'),
(125, 1, '', '', '2025-07-26 12:22:31'),
(126, 8, 'Abhijit Gupta', '', '2025-07-26 14:22:15'),
(127, 1, '', '', '2025-07-26 21:47:21'),
(128, 10, 'arjuna', '', '2025-07-26 21:51:16'),
(129, 10, 'shub', '', '2025-07-30 14:48:40');

-- --------------------------------------------------------

--
-- Table structure for table `form_responses`
--

CREATE TABLE `form_responses` (
  `id` int(11) NOT NULL,
  `respondent_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_responses`
--

INSERT INTO `form_responses` (`id`, `respondent_id`, `question_id`, `answer`) VALUES
(1, 101, 1, 'Yes'),
(2, 101, 2, 'Everything was great.'),
(3, 101, 3, 'Topic A'),
(4, 101, 4, '5'),
(5, 101, 5, 'Yes'),
(6, 102, 1, 'No'),
(7, 102, 2, 'More examples needed.'),
(8, 102, 3, 'Topic B'),
(9, 102, 4, '3'),
(10, 102, 5, 'No'),
(11, 103, 1, 'Maybe'),
(12, 103, 2, 'Class was okay.'),
(13, 103, 3, 'Topic C'),
(14, 103, 4, '4'),
(15, 103, 5, 'Not Sure'),
(16, 121, 21, 'US'),
(17, 121, 22, '[\"Bag\",\"Camera\"]'),
(18, 122, 21, 'UK'),
(19, 122, 22, '[\"Tent\"]'),
(20, 122, 23, '1'),
(21, 123, 21, 'UK'),
(22, 123, 22, '[\"Camera\"]'),
(23, 123, 23, '1'),
(24, 124, 20, 'Rajiv'),
(25, 124, 21, 'US'),
(26, 124, 22, '[\"Bag\"]'),
(27, 124, 23, '5'),
(28, 125, 1, 'Yes'),
(29, 125, 2, 'No'),
(30, 125, 3, 'Topic A'),
(31, 125, 4, '3'),
(32, 125, 5, 'Yes'),
(33, 126, 24, 'Abhijit Gupta'),
(34, 126, 25, '2023'),
(35, 127, 1, 'Yes'),
(36, 127, 2, 'good'),
(37, 127, 3, 'Topic C'),
(38, 127, 4, '4'),
(39, 127, 5, 'No'),
(40, 128, 27, 'arjuna'),
(41, 129, 27, 'shub');

-- --------------------------------------------------------

--
-- Table structure for table `otp_resets`
--

CREATE TABLE `otp_resets` (
  `id` int(11) NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT (current_timestamp() + interval 10 minute)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `phone`, `password`, `created_at`) VALUES
(1, '', NULL, '$2y$10$h8iJbcWEArbskEmyObChI.YebDa..Sjesk.8sBnRbjf2XGglLVhlm', '2025-07-12 09:47:38'),
(2, 'parthmistricct@gmail.com', NULL, '$2y$10$e/DPYDYhRLaft0dBTqozWeVfTGzK9dR6p6wcU93grrL9mGCH1/EkW', '2025-07-12 09:47:38'),
(3, 'user1@gmail.com', NULL, '$2y$10$9JxEj2eq839RS/RMWYFoM.uEOR04bZbED1WQHmfuMsR.5ADp.PyTm', '2025-07-18 12:08:28'),
(4, 'user2@gmail.com', NULL, '$2y$10$9Daz3uEps6I3iB/KUtzX4.aXS3DzejcAned6xpEoqPV7vxv0IcGe.', '2025-07-30 16:15:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `form_options`
--
ALTER TABLE `form_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `form_questions`
--
ALTER TABLE `form_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_id` (`form_id`);

--
-- Indexes for table `form_respondents`
--
ALTER TABLE `form_respondents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_id` (`form_id`);

--
-- Indexes for table `form_responses`
--
ALTER TABLE `form_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `respondent_id` (`respondent_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `otp_resets`
--
ALTER TABLE `otp_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `forms`
--
ALTER TABLE `forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `form_options`
--
ALTER TABLE `form_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `form_questions`
--
ALTER TABLE `form_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `form_respondents`
--
ALTER TABLE `form_respondents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT for table `form_responses`
--
ALTER TABLE `form_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `otp_resets`
--
ALTER TABLE `otp_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
