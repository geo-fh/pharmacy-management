-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 23, 2022 at 01:53 AM
-- Server version: 5.7.36
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pharmacy`
--

-- --------------------------------------------------------

--
-- Table structure for table `allergy`
--

DROP TABLE IF EXISTS `allergy`;
CREATE TABLE IF NOT EXISTS `allergy` (
  `allergy_id` int(11) NOT NULL AUTO_INCREMENT,
  `allergy_name` varchar(20) NOT NULL,
  PRIMARY KEY (`allergy_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `allergy`
--

INSERT INTO `allergy` (`allergy_id`, `allergy_name`) VALUES
(1, 'Penicilin'),
(2, 'Aspirin'),
(3, 'Ibuprofen'),
(4, 'Sulfonamides');

-- --------------------------------------------------------

--
-- Table structure for table `current_medication`
--

DROP TABLE IF EXISTS `current_medication`;
CREATE TABLE IF NOT EXISTS `current_medication` (
  `patient_id` int(11) NOT NULL,
  `medication_id` int(11) NOT NULL,
  PRIMARY KEY (`patient_id`,`medication_id`),
  KEY `medication_id` (`medication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `disease`
--

DROP TABLE IF EXISTS `disease`;
CREATE TABLE IF NOT EXISTS `disease` (
  `disease_id` int(11) NOT NULL AUTO_INCREMENT,
  `disease_name` varchar(30) NOT NULL,
  `disease_type` varchar(15) NOT NULL,
  PRIMARY KEY (`disease_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `disease`
--

INSERT INTO `disease` (`disease_id`, `disease_name`, `disease_type`) VALUES
(1, 'Anxiety', 'Mental'),
(2, 'Asthma', 'Physiological'),
(3, 'Bipolar Disorder', 'Mental'),
(4, 'Bronchitis', 'Autoimmune'),
(5, 'Cholesterol', 'Physiological'),
(6, 'COVID19', 'Infectious'),
(7, 'Depression', 'Mental'),
(8, 'Diabetes, Type I', 'Physiological'),
(9, 'Diabetes, Type II', 'Physiological'),
(10, 'Fibromyalgia', 'Autoimmune'),
(11, 'Hypertension', 'Physiological'),
(12, 'Iron deficiency anaemia', 'Deficiency'),
(13, 'Lung cancer', 'Physiological'),
(14, 'Osteoarthritis', 'Autoimmune'),
(15, 'Osteoporosis', 'Physiological'),
(16, 'Pneumonia', 'Physiological'),
(17, 'Psoriasis', 'Physiological'),
(18, 'Rheumatoid Arthritis', 'Autoimmune'),
(19, 'Schizophrenia', 'Mental'),
(20, 'Vitamin B12 deficiency', 'Deficiency');

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
CREATE TABLE IF NOT EXISTS `doctor` (
  `doctor_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `specialty_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`doctor_id`),
  KEY `user_id` (`user_id`),
  KEY `specialty_id` (`specialty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`doctor_id`, `user_id`, `first_name`, `last_name`, `mobile_number`, `specialty_id`) VALUES
(1, 4, 'Ali', 'Aoun', '+961 70 301 330', 2),
(2, 5, 'Pamela', 'Bassil', '+961 70 615 300', 9),
(3, 6, 'Mang', 'Cathy', '+961 71 133 219', 12),
(4, 7, 'Chadi', 'Haddad', '+961 70 700 831', 10),
(5, 8, 'Imad', 'Husseini', '+961 71 917 733', 4),
(6, 9, 'Daoud', 'Joseph', '+961 71 163 826', 5),
(7, 10, 'Kabalan', 'Kabalan', '+961 70 868 479', 1),
(8, 11, 'Imad', 'Kaddoura', '+961 70 277 310', 11),
(9, 12, 'Michel', 'Kenaan', '+961 71 606 213', 8),
(10, 13, 'Fawzi', 'Mitri', '+961 70 276 565', 7),
(11, 14, 'Rawan', 'Saab', '+961 71 228 007', 3),
(12, 15, 'Abdallah', 'Said', '+961 70 229 317', 5),
(13, 16, 'Aboul', 'Salem', '+961 70 308 562', 2),
(14, 17, 'Jihad', 'Sayegh', '+961 70 645 032', 2),
(15, 18, 'Hanna', 'Semaan', '+961 71 662 166', 2),
(16, 19, 'Razmig', 'Vosgueritchian', '+961 70 178 142', 6),
(17, 20, 'Mohamad', 'Wehbe', '+961 71 688 659', 5);

-- --------------------------------------------------------

--
-- Table structure for table `manufacturer`
--

DROP TABLE IF EXISTS `manufacturer`;
CREATE TABLE IF NOT EXISTS `manufacturer` (
  `manufacturer_id` int(11) NOT NULL AUTO_INCREMENT,
  `manufacturer_name` varchar(60) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `email_address` varchar(50) NOT NULL,
  `address` varchar(20) NOT NULL,
  PRIMARY KEY (`manufacturer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `manufacturer`
--

INSERT INTO `manufacturer` (`manufacturer_id`, `manufacturer_name`, `contact_number`, `email_address`, `address`) VALUES
(1, 'Benta SAL', '+961 1 726 125', 'contact@benta.com', 'Lebanon'),
(2, 'Chiesi Farmaceutici SpA', '+39 06 570 5679', 'contact@chiesifarmaceutici.com', 'Italy'),
(3, 'Delpharm Dijon', '+33 93 162 4875', 'contact@delpharmdijon.com', 'France'),
(4, 'Delpharm Reims', '+33 93 391 6059', 'contact@delpharmreims.com', 'France'),
(5, 'European Egyptian Pharmaceutical Industries', '+20 117 516 1810', 'contact@europeanegyptianpharmaceutical.com', 'Egypt'),
(6, 'GlaxoSmithKline Dungarvan Ltd', '+353 20 913 3155', 'contact@glaxosmithklinedungarvan.com', 'Ireland'),
(7, 'Lusomedicamenta Sociedade Tecnica Farmaceutica SA', '+351 994 304 721 ', 'contact@lusomedicamentastf.com', 'Portugal'),
(8, 'Pf Consumer Healthcare Canada ULC', '+1 (840) 664 1331', 'contact@pfchculc.com', 'Canada'),
(9, 'Pfizer Pharmaceutical', '+49 30 137902666', 'contact@pfizer.com', 'Germany'),
(10, 'Pharmadex', '+961 1 864 353', 'contact@pharmadex.com', 'Lebanon'),
(11, 'Pharmaline SAL', '+961 1 552 440', 'contact@pharmaline.com', 'Lebanon'),
(12, 'RAM Pharmaceutical Industries Co Ltd', '+962 7 524 8740', 'contact@rampicl.com', 'Jordan'),
(13, 'Sanico NV', '+32 470 36 84 05', 'contact@sanico.com', 'Belgium'),
(14, 'Sanofi Winthrop Industrie', '+33 93 668 8616', 'contact@sanofiwinthropindustrie.com', 'France'),
(15, 'Schering Plough Labo NV', '+32 450 73 93 02', 'contact@scheringploughlabo.com', 'Belgium'),
(16, 'Spimaco', '+966 11 357 8984', 'contact@spimaco.com', 'Saudi Arabia'),
(17, 'The Jordanian Pharmaceutical Manufacturing & Co Ltd', '+962 7 865 6699', 'contact@tjpmco.com', 'Jordan');

-- --------------------------------------------------------

--
-- Table structure for table `medication`
--

DROP TABLE IF EXISTS `medication`;
CREATE TABLE IF NOT EXISTS `medication` (
  `medication_id` int(11) NOT NULL AUTO_INCREMENT,
  `medication_name` varchar(20) NOT NULL,
  `active_ingredient` varchar(20) NOT NULL,
  `ingredients` varchar(300) NOT NULL,
  `contraindications` varchar(100) DEFAULT NULL,
  `dosage` varchar(10) NOT NULL,
  `price` int(11) NOT NULL,
  `isOTC` varchar(3) NOT NULL,
  `units_per_package` int(11) NOT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `leaflet` varchar(100) NOT NULL,
  PRIMARY KEY (`medication_id`),
  KEY `manufacturer_id` (`manufacturer_id`),
  KEY `supplier_id` (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `medication`
--

INSERT INTO `medication` (`medication_id`, `medication_name`, `active_ingredient`, `ingredients`, `contraindications`, `dosage`, `price`, `isOTC`, `units_per_package`, `manufacturer_id`, `supplier_id`, `leaflet`) VALUES
(1, 'Advil Liqui-Gels', 'ibuprofen', 'gelatin, lecithin, triglycerides, polyethylene glycol, potassium hydroxide, sorbitol, sorbitan', 'aspirin', '200mg', 112389, 'yes', 32, 8, 11, 'https://www.advil.com/content/dam/cf-consumer-healthcare/bp-advil/es_US/pdf/advil-liqui-gels.pdf'),
(2, 'Aerius', 'desloratadine', 'desloratadine', 'loratadine, pregnancy', '5mg', 153480, 'yes', 30, 15, 1, 'https://www.nps.org.au/assets/medicines/2ad791e6-7157-42fe-98e1-a53300ff289b.pdf'),
(3, 'Augmentin', 'amoxicillin', 'magnesium stearate, sodium starch glycolate type A, colloidal anhydrous silica, microcrystalline cellulose, titanium dioxide, hypromellose, macrogol, dimeticone', NULL, '625mg', 160640, 'no', 14, 11, 1, 'https://www.medicines.org.uk/emc/files/pil.281.pdf'),
(4, 'Brufen', 'ibuprofen', 'microcrystalline cellulose, croscarmellose sodium, lactose monohydrate, colloidal anhydrous silica, sodium laurilsulfate, magnesium stearate', 'pregnancy', '600mg', 98924, 'yes', 30, 11, 8, 'https://www.medicines.org.uk/emc/files/pil.6713.pdf'),
(5, 'Cataflam', 'diclofenac potassium', 'benzeneacetic acid, monopotassium salt', 'asthma, urticaria, aspirin', '50mg', 161526, 'yes', 20, 11, 6, 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2009/020142s019lbl.pdf'),
(6, 'Celebrex', 'celecoxib', 'lactose monohydrate, sodium laurilsulfate, povidone, croscarmellose sodium, magnesium stearate, gelatin, titanium dioxide, sodium laurilsulfate, sorbitan monolaurate, iron oxide, shellac, propylene glycol', 'asthma, aspirin, pregnancy', '200mg', 272203, 'no', 30, 9, 5, 'https://www.medicines.org.uk/emc/files/pil.2945.pdf'),
(7, 'Chlorpromazine', 'thorazine', 'chlorpromazine hydrochloride, lactose, maize starch, povidone, sodium starch glycollate, colloidal anhydrous silica, magnesium stearate, hypromellose, ethylcellulose, diethylphthalate and titanium dioxide', 'glaucoma, breast-feeding', '100mg', 45600, 'no', 50, 10, 9, 'https://www.medicines.org.uk/emc/files/pil.4558.pdf'),
(8, 'D-Vital', 'cholecalciferol', 'vitamin d3 (cholecalciferol), tocopherol, medium chain triglycerides, silicon dioxide, starch, sucrose, vitamin c (sodium ascorbate)', 'pregnancy', '10,000IU', 80517, 'yes', 30, 11, 10, 'https://www.pharmaline.com.lb/ContentFiles/1654PIL.pdf'),
(9, 'Etoxa', 'etoricoxib', 'microcrystalline cellulose, calcium hydrogen phosphate, croscarmellose sodium, magnesium stearate, polyvinyl alcohol, titanium dioxide, glycerol monostearate, talc, sodium laurilsulfate', 'pregnancy, lactation, severe hepatic dysfunction, congestive heart failure', '90mg', 164888, 'no', 30, 11, 10, 'https://www.pharmaline.com.lb/ContentFiles/1655PIL.pdf'),
(10, 'Fenadex 120', 'fexofenadine', 'powdered cellulose, mannitol, maize starch, croscarmellose sodium, colloidal', 'pregnancy, lactation', '120mg', 91158, 'yes', 30, 17, 3, 'https://www.medicines.org.uk/emc/files/pil.11487.pdf'),
(11, 'Flocazole', 'fluconazole', 'lactose monohydrate, maize starch, sodium lauril sulphate, colloidal silica anhydrous, magnesium stearate, titanium dioxide, sodium lauril sulfate, gelatin, shellac, propylene glycol, yellow iron oxide', 'pregnancy', '150mg', 39688, 'no', 1, 16, 6, 'https://www.medicines.org.uk/emc/files/pil.6086.pdf'),
(12, 'Glucophage', 'metformin', 'povidone, magnesium stearate, hypromellose', 'metabolic acidosis, severe renal failure, dehydration, severe infection, shock', '1000mg', 52588, 'no', 30, 11, 5, 'https://www.medicines.org.uk/emc/files/pil.987.pdf'),
(13, 'Levipram 1000', 'levetiracetam', 'croscarmellose sodium, macrogol, silica colloidal anhydrous, magnesium stearate, polyvinyl alcohol, titanium dioxide, macrogol 3350, talc', 'lactation', '1000mg', 166425, 'yes', 100, 1, 2, 'https://bpi.com.lb/bpi/wp-content/uploads/2020/06/Levipram.pdf'),
(14, 'Metronidazole 250', 'nitroimidazoles', 'lactose, maize starch, povidone, magnesium stearate, carmellose sodium, microcrystalline cellulose, purified water, methylhydroxypropylcellulose, macrogol 400, titanium dioxide', 'pregnancy', '250mg', 11345, 'no', 20, 10, 9, 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/018845s014,018930s013lbl.pdf'),
(15, 'Motilium', 'domperidone', 'lactose monohydrate, maize starch, microcrystalline cellulose, pregelatinised starch, povidone k90, magnesium stearate, silica colloidal hydrated, polysorbate 20, hypromellose, propylene glycol', 'prolactinoma, hepatic impairment', '10mg', 91468, 'no', 30, 7, 8, 'https://www.medicines.org.uk/emc/files/pil.4177.pdf'),
(16, 'Mucosolvan', 'ambroxol', 'ambroxol hydrochloride, lactose, maize starch dried, silica colloidal anhydrous, magnesium stearate', NULL, '30mg', 62012, 'yes', 20, 4, 8, 'https://mri.cts-mrp.eu/human/downloads/CZ_H_0606_002_FinalPL_1of2.pdf'),
(17, 'Ospamox', 'amoxycillin', 'amoxicillin trihydrate, magnesium stearate, colloidal anhydrous silica, gelatin, carmoisine, quinoline yellow, titanium dioxide', NULL, '750mg', 116642, 'no', 16, 11, 6, 'https://pharmacia1.com/wp-content/uploads/2015/08/ospamox-pil.pdf'),
(18, 'Panadol Advance', 'paracetamol', 'pregelatinised starch, calcium carbonate, alginic acid, crospovidone, povidone, magnesium stearate, colloidal anhydrous silica and sodium methyl, sodium ethyl, sodium propyl, parahydroxybenzoates', NULL, '500mg', 33132, 'yes', 24, 6, 11, 'https://www.medicines.org.uk/emc/files/pil.6512.pdf'),
(19, 'Primazol 40', 'esomeprazole', 'esomeprazole', 'lactation', '40mg', 27206, 'no', 10, 1, 2, 'https://www.medicines.org.uk/emc/files/pil.2610.pdf'),
(20, 'Primperan', 'metoclopramide ', 'metoclopramide hydrochloride monohydrate,  lactose monohydrate', 'epilepsy', '10mg', 51780, 'yes', 40, 3, 8, 'https://www.medicines.org.uk/emc/files/pil.5427.pdf'),
(21, 'Prylex 20', 'cipralex', 'microcrystalline cellulose, colloidal silicon dioxide, croscarmellose sodium, magnesium stearate, talc, hydroxypropyl methylcellulose, polysorbate, polyethylene glycol, titanium dioxide', NULL, '20mg', 207138, 'no', 30, 1, 2, 'https://bpi.com.lb/bpi/wp-content/uploads/2020/05/Prylex.pdf'),
(22, 'Rixalta 20', 'rivaroxaban', 'lactose monohydrate, croscarmellose sodium, microcrystalline cellulose, hydroxypropyl methyl cellulose, sodium lauryl sulfate, magnesium stearate, hypromellose, titanium dioxide, macrogol', 'pregnancy', '20mg', 482550, 'no', 30, 1, 2, 'https://bpi.com.lb/wp-content/uploads/2021/02/Rixalta-15-and-20-Insert.pdf'),
(23, 'Surgam', 'tiaprofenic acid', 'maize starch, poloxamer, magnesium stearate, purified talc', 'asthma', '300mg', 101700, 'yes', 20, 14, 8, 'https://www.medicines.org.uk/emc/files/pil.2256.pdf'),
(24, 'Voltaren 50', 'diclofenac', 'cellulose microcrystalline, sodium carboxymethyl starch, croscarmellose sodium, silica aerogel, hydrogenated castor oil, talc', 'anemia, asthma, pregnancy, high blood pressure', '50mg', 93904, 'yes', 20, 11, 6, 'https://www.medsafe.govt.nz/consumers/cmi/v/VoltarenTab.pdf'),
(25, 'Xanax', 'benzodiazepines', 'cellulose, corn starch, docusate sodium, lactose, magnesium stearate, silicon dioxide and sodium benzoate', NULL, '0.5mg', 29810, 'no', 30, 13, 4, 'https://www.medicines.org.uk/emc/files/pil.1656.pdf'),
(26, 'Zoloft', 'sertraline', 'dibasic calcium phosphate dihydrate, hydroxypropyl cellulose, hypromellose, magnesium stearate, microcrystalline cellulose, polyethylene glycol, polysorbate 80, sodium starch glycolate, titanium dioxide', NULL, '50mg', 57328, 'no', 15, 9, 7, 'https://www.medicines.org.uk/emc/files/pil.4348.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `purchase_date` date NOT NULL,
  `cancel_date` date DEFAULT NULL,
  `total_price` int(11) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_medication`
--

DROP TABLE IF EXISTS `order_medication`;
CREATE TABLE IF NOT EXISTS `order_medication` (
  `order_id` int(11) NOT NULL,
  `medication_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`order_id`,`medication_id`),
  KEY `medication_id` (`medication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
CREATE TABLE IF NOT EXISTS `patient` (
  `patient_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `date_of_birth` date NOT NULL,
  `address` varchar(100) NOT NULL,
  `mobile_number` varchar(15) NOT NULL,
  PRIMARY KEY (`patient_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`patient_id`, `user_id`, `first_name`, `last_name`, `date_of_birth`, `address`, `mobile_number`) VALUES
(1, 21, 'John', 'Doe', '1995-11-16', 'Beirut', '+961 70 123 456');

-- --------------------------------------------------------

--
-- Table structure for table `patient_allergy`
--

DROP TABLE IF EXISTS `patient_allergy`;
CREATE TABLE IF NOT EXISTS `patient_allergy` (
  `patient_id` int(11) NOT NULL,
  `allergy_id` int(11) NOT NULL,
  PRIMARY KEY (`patient_id`,`allergy_id`),
  KEY `allergy_id` (`allergy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `patient_disease`
--

DROP TABLE IF EXISTS `patient_disease`;
CREATE TABLE IF NOT EXISTS `patient_disease` (
  `patient_id` int(11) NOT NULL,
  `disease_id` int(11) NOT NULL,
  PRIMARY KEY (`patient_id`,`disease_id`),
  KEY `disease_id` (`disease_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacist`
--

DROP TABLE IF EXISTS `pharmacist`;
CREATE TABLE IF NOT EXISTS `pharmacist` (
  `pharmacist_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `start_of_work_date` date NOT NULL,
  `end_of_work_date` date DEFAULT NULL,
  PRIMARY KEY (`pharmacist_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pharmacist`
--

INSERT INTO `pharmacist` (`pharmacist_id`, `user_id`, `first_name`, `last_name`, `mobile_number`, `start_of_work_date`, `end_of_work_date`) VALUES
(1, 1, 'Layla', 'Nader', '+961 70 081 635', '2013-06-19', '2017-07-17'),
(2, 2, 'Maya', 'Yazbeck', '+961 71 076 198', '2015-01-24', NULL),
(3, 3, 'Sami', 'Antoun', '+961 70 109 315', '2016-05-28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
CREATE TABLE IF NOT EXISTS `prescription` (
  `prescription_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`prescription_id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `prescription_medication`
--

DROP TABLE IF EXISTS `prescription_medication`;
CREATE TABLE IF NOT EXISTS `prescription_medication` (
  `prescription_id` int(11) NOT NULL,
  `medication_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `usage_directions` int(11) NOT NULL,
  PRIMARY KEY (`prescription_id`,`medication_id`),
  KEY `medication_id` (`medication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `specialty`
--

DROP TABLE IF EXISTS `specialty`;
CREATE TABLE IF NOT EXISTS `specialty` (
  `specialty_id` int(11) NOT NULL AUTO_INCREMENT,
  `specialty_name` varchar(20) NOT NULL,
  PRIMARY KEY (`specialty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `specialty`
--

INSERT INTO `specialty` (`specialty_id`, `specialty_name`) VALUES
(1, 'Cardiology'),
(2, 'Dentist'),
(3, 'Endocrinology'),
(4, 'Forensic Dentistry'),
(5, 'General Practitioner'),
(6, 'Geriatrics'),
(7, 'Gynecology'),
(8, 'Orthopedy'),
(9, 'Periodontology'),
(10, 'Physiotherapy'),
(11, 'Plastic Surgery'),
(12, 'Psychology');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
CREATE TABLE IF NOT EXISTS `stock` (
  `batch_id` int(11) NOT NULL AUTO_INCREMENT,
  `medication_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `expiration_date` date NOT NULL,
  PRIMARY KEY (`batch_id`),
  KEY `medication_id` (`medication_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`batch_id`, `medication_id`, `quantity`, `expiration_date`) VALUES
(1, 1, 68, '2024-02-13'),
(2, 1, 13, '2023-11-06'),
(3, 2, 25, '2023-10-18'),
(4, 2, 74, '2023-08-17'),
(5, 3, 78, '2024-10-01'),
(6, 3, 62, '2024-09-22'),
(7, 4, 68, '2023-03-06'),
(8, 4, 30, '2024-09-23'),
(9, 5, 24, '2024-04-18'),
(10, 5, 21, '2022-10-04'),
(11, 6, 5, '2024-07-22'),
(12, 6, 78, '2024-10-14'),
(13, 7, 11, '2024-08-03'),
(14, 7, 77, '2024-08-29'),
(15, 8, 3, '2024-04-06'),
(16, 8, 6, '2024-05-05'),
(17, 9, 8, '2022-10-02'),
(18, 9, 72, '2024-07-21'),
(19, 10, 27, '2023-05-28'),
(20, 10, 62, '2023-10-16'),
(21, 11, 73, '2024-02-16'),
(22, 11, 50, '2022-12-15'),
(23, 12, 60, '2024-07-29'),
(24, 12, 18, '2023-05-02'),
(25, 13, 69, '2024-09-04'),
(26, 13, 8, '2022-09-23'),
(27, 14, 78, '2022-12-27'),
(28, 14, 32, '2023-02-13'),
(29, 15, 3, '2023-09-29'),
(30, 15, 39, '2023-02-16'),
(31, 16, 47, '2023-03-10'),
(32, 16, 50, '2022-08-23'),
(33, 17, 74, '2022-12-09'),
(34, 17, 43, '2024-12-10'),
(35, 18, 79, '2023-10-02'),
(36, 18, 22, '2024-01-04'),
(37, 19, 71, '2023-04-14'),
(38, 19, 2, '2023-07-08'),
(39, 20, 40, '2023-09-11'),
(40, 20, 5, '2023-03-16'),
(41, 21, 77, '2023-11-02'),
(42, 21, 73, '2023-05-14'),
(43, 22, 49, '2022-09-30'),
(44, 22, 59, '2024-06-06'),
(45, 23, 7, '2024-02-19'),
(46, 23, 52, '2023-06-15'),
(47, 24, 8, '2023-10-14'),
(48, 24, 77, '2022-09-29'),
(49, 25, 34, '2024-06-18'),
(50, 25, 13, '2023-12-24');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE IF NOT EXISTS `supplier` (
  `supplier_id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(30) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `email_address` varchar(40) NOT NULL,
  `address` varchar(20) NOT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplier_id`, `supplier_name`, `contact_number`, `email_address`, `address`) VALUES
(1, 'Abela Frères S.A.L.', '+961 1 595 100', 'contact@abelafreres.com', 'Lebanon'),
(2, 'Benta Trading Co s.a.l.', '+961 1 511 211', 'contact@bentatradingco.com', 'Lebanon'),
(3, 'C. Catafago & Co', '+961 1 340 425', 'contact@ccatafagoco.com', 'Lebanon'),
(4, 'Droguerie Fattal  S.A.L.', '+961 1 512 002', 'contact@drogueriefattal.com', 'Lebanon'),
(5, 'Food & Drug Corporation FDC', '+961 1 862 000', 'contact@fooddrugcorporationfdc.com', 'Lebanon'),
(6, 'Khalil Fattal & Fils S.A.L.', '+961 1 512 002', 'contact@khalilfattalfils.com', 'Lebanon'),
(7, 'Mectapharm S.A.L.', '+961 4 543 701', 'contact@mectapharm.com', 'Lebanon'),
(8, 'Mersaco', '+961 1 396 000', 'contact@mersaco.com', 'Lebanon'),
(9, 'Pharmadex', '+961 5 769 119', 'contact@pharmadex.com', 'Lebanon'),
(10, 'Pharmaline S.A.L.', '+961 9 444 450', 'contact@pharmaline.com', 'Lebanon'),
(11, 'Sadco', '+961 1 855 560', 'contact@sadco.com', 'Lebanon'),
(12, 'The Lebanese Pharmacists SAL', '+961 1 662 800', 'contact@thelebanesepharmacists.com', 'Lebanon');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email_address` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL,
  `user_type` int(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email_address`, `password`, `user_type`) VALUES
(1, 'nader.layla@gmail.com', 'layla1800', 1),
(2, 'yazbeck.maya@gmail.com', 'maya1800', 1),
(3, 'antoun.sami@gmail.com', 'sami1800', 1),
(4, 'aoun.ali@gmail.com', 'ali1900', 2),
(5, 'bassil.pamela@gmail.com', 'pamela1900', 2),
(6, 'cathy.mang@gmail.com', 'mang1900', 2),
(7, 'haddad.chadi@gmail.com', 'chadi1900', 2),
(8, 'husseini.imad@gmail.com', 'imad1900', 2),
(9, 'joseph.daoud@gmail.com', 'daoud1900', 2),
(10, 'kabalan.kabalan@gmail.com', 'kabalan1900', 2),
(11, 'kaddoura.imad@gmail.com', 'imad1900', 2),
(12, 'kenaan.michel@gmail.com', 'michel1900', 2),
(13, 'mitri.fawzi@gmail.com', 'fawzi1900', 2),
(14, 'saab.rawan@gmail.com', 'rawan1900', 2),
(15, 'said.abdallah@gmail.com', 'abdallah1900', 2),
(16, 'salem.aboul@gmail.com', 'aboul1900', 2),
(17, 'sayegh.jihad@gmail.com', 'jihad1900', 2),
(18, 'semaan.hanna@gmail.com', 'hanna1900', 2),
(19, 'vosgueritchian.razmig@gmail.com', 'razmig1900', 2),
(20, 'wehbe.mohamad@gmail.com', 'mohamad1900', 2),
(21, 'patient@hello.com', 'password1', 3);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `current_medication`
--
ALTER TABLE `current_medication`
  ADD CONSTRAINT `current_medication_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `current_medication_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `doctor`
--
ALTER TABLE `doctor`
  ADD CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `doctor_ibfk_2` FOREIGN KEY (`specialty_id`) REFERENCES `specialty` (`specialty_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `medication`
--
ALTER TABLE `medication`
  ADD CONSTRAINT `medication_ibfk_1` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturer` (`manufacturer_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `medication_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `pharmacist` (`pharmacist_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_medication`
--
ALTER TABLE `order_medication`
  ADD CONSTRAINT `order_medication_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_medication_ibfk_2` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_allergy`
--
ALTER TABLE `patient_allergy`
  ADD CONSTRAINT `patient_allergy_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `patient_allergy_ibfk_2` FOREIGN KEY (`allergy_id`) REFERENCES `allergy` (`allergy_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_disease`
--
ALTER TABLE `patient_disease`
  ADD CONSTRAINT `patient_disease_ibfk_1` FOREIGN KEY (`disease_id`) REFERENCES `disease` (`disease_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `patient_disease_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pharmacist`
--
ALTER TABLE `pharmacist`
  ADD CONSTRAINT `pharmacist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `prescription`
--
ALTER TABLE `prescription`
  ADD CONSTRAINT `prescription_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prescription_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `prescription_medication`
--
ALTER TABLE `prescription_medication`
  ADD CONSTRAINT `prescription_medication_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescription` (`prescription_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prescription_medication_ibfk_2` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
