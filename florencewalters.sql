-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 07, 2026 at 02:08 PM
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
-- Database: `florencewalters`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `username`, `password`, `admin_type`) VALUES
(1, 'Super Admin', 'info@something.com', 'superadmin', 'Business5959', 'superadmin');

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
CREATE TABLE IF NOT EXISTS `blog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blog_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `heading` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` int NOT NULL,
  `preamble` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `featured` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `comments_allowed` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog`
--

INSERT INTO `blog` (`id`, `blog_id`, `heading`, `slug`, `category`, `preamble`, `body`, `picture`, `featured`, `date`, `keywords`, `comments_allowed`) VALUES
(1, 'e8f8c5f207', 'Building a Practical Compliance and Governance Framework', 'building-a-practical-compliance-and-governance-framework', 2, 'True compliance and good governance are not just about rules; they are about building systems that protect the organization, support decision-making, and enable sustainable growth.', '<p data-start=\"511\" data-end=\"944\">In many organizations, compliance is treated as a box-ticking exercise something to satisfy regulators and auditors rather than a core part of how the business is run. While this approach may reduce short-term pressure, it often creates long-term risk. True compliance and good governance are not just about rules; they are about building systems that protect the organization, support decision-making, and enable sustainable growth.</p>\r\n<h3 data-start=\"946\" data-end=\"1001\">Why Compliance and Governance Matter More Than Ever</h3>\r\n<p data-start=\"1003\" data-end=\"1296\">Regulatory environments are becoming more complex across sectors, from financial services and fintech to NGOs and public institutions. At the same time, stakeholders investors, partners, donors, and customers are demanding higher standards of transparency, accountability, and data protection.</p>\r\n<p data-start=\"1298\" data-end=\"1364\">Organizations that treat compliance as an afterthought often face:</p>\r\n<ul data-start=\"1365\" data-end=\"1565\">\r\n<li data-start=\"1365\" data-end=\"1411\">\r\n<p data-start=\"1367\" data-end=\"1411\">Increased regulatory and reputational risk</p>\r\n</li>\r\n<li data-start=\"1412\" data-end=\"1465\">\r\n<p data-start=\"1414\" data-end=\"1465\">Weak internal controls and unclear accountability</p>\r\n</li>\r\n<li data-start=\"1466\" data-end=\"1513\">\r\n<p data-start=\"1468\" data-end=\"1513\">Inefficient processes and duplicated effort</p>\r\n</li>\r\n<li data-start=\"1514\" data-end=\"1565\">\r\n<p data-start=\"1516\" data-end=\"1565\">Poor readiness for audits or regulatory reviews</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"1567\" data-end=\"1763\">On the other hand, organizations that invest in strong governance and practical compliance frameworks benefit from clearer decision-making, stronger oversight, and greater trust from stakeholders.</p>\r\n<h3 data-start=\"1765\" data-end=\"1799\">Moving from Policy to Practice</h3>\r\n<p data-start=\"1801\" data-end=\"1986\">One of the most common challenges we see is the gap between policy and reality. Many organizations have well-written policies, but those policies are not embedded into daily operations.</p>\r\n<p data-start=\"1988\" data-end=\"2043\">A practical compliance and governance framework should:</p>\r\n<ul data-start=\"2044\" data-end=\"2306\">\r\n<li data-start=\"2044\" data-end=\"2113\">\r\n<p data-start=\"2046\" data-end=\"2113\">Be aligned with the organization’s size, sector, and risk profile</p>\r\n</li>\r\n<li data-start=\"2114\" data-end=\"2159\">\r\n<p data-start=\"2116\" data-end=\"2159\">Clearly define roles and responsibilities</p>\r\n</li>\r\n<li data-start=\"2160\" data-end=\"2206\">\r\n<p data-start=\"2162\" data-end=\"2206\">Be supported by simple, workable processes</p>\r\n</li>\r\n<li data-start=\"2207\" data-end=\"2251\">\r\n<p data-start=\"2209\" data-end=\"2251\">Include regular monitoring and reporting</p>\r\n</li>\r\n<li data-start=\"2252\" data-end=\"2306\">\r\n<p data-start=\"2254\" data-end=\"2306\">Be understood by staff, not just senior management</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"2308\" data-end=\"2479\">This is where compliance audits and gap assessments are particularly useful. They help organizations understand what is working, what is not, and where the real risks lie.</p>\r\n<h3 data-start=\"2481\" data-end=\"2526\">Key Building Blocks of a Strong Framework</h3>\r\n<p data-start=\"2528\" data-end=\"2594\">A robust approach to compliance and governance typically includes:</p>\r\n<ul data-start=\"2595\" data-end=\"3065\">\r\n<li data-start=\"2595\" data-end=\"2688\">\r\n<p data-start=\"2597\" data-end=\"2688\"><strong data-start=\"2597\" data-end=\"2629\">Clear governance structures:</strong> Defined roles for boards, management, and key committees</p>\r\n</li>\r\n<li data-start=\"2689\" data-end=\"2770\">\r\n<p data-start=\"2691\" data-end=\"2770\"><strong data-start=\"2691\" data-end=\"2730\">Risk-based policies and procedures:</strong> Focused on the areas that matter most</p>\r\n</li>\r\n<li data-start=\"2771\" data-end=\"2885\">\r\n<p data-start=\"2773\" data-end=\"2885\"><strong data-start=\"2773\" data-end=\"2820\">AML/CFT, KYC, and data protection controls:</strong> Especially important in regulated and data-driven environments</p>\r\n</li>\r\n<li data-start=\"2886\" data-end=\"2962\">\r\n<p data-start=\"2888\" data-end=\"2962\"><strong data-start=\"2888\" data-end=\"2924\">Regular reporting and oversight:</strong> To support informed decision-making</p>\r\n</li>\r\n<li data-start=\"2963\" data-end=\"3065\">\r\n<p data-start=\"2965\" data-end=\"3065\"><strong data-start=\"2965\" data-end=\"3000\">Ongoing training and awareness:</strong> So staff understand both the rules and the reasons behind them</p>\r\n</li>\r\n</ul>\r\n<h3 data-start=\"3067\" data-end=\"3119\">The Payoff: Confidence, Credibility, and Control</h3>\r\n<p data-start=\"3121\" data-end=\"3384\">When compliance and governance are done well, they stop being a burden and start becoming a strategic advantage. Organizations gain better control over their operations, greater confidence in their decisions, and stronger credibility with regulators and partners.</p>\r\n<p data-start=\"3386\" data-end=\"3533\">In today’s environment, the question is no longer whether you can afford to invest in governance and compliance it’s whether you can afford not to.</p>', 'bbc5a93bd3.webp', 'Yes', '2025-05-01', 'Building a Practical Compliance and Governance Framework True compliance and good governance are not just about rules; they are about building systems that protect the organization, support decision-making, and enable sustainable growth. <p data-start=\"511\" data-end=\"944\">In many organizations, compliance is treated as a box-ticking exercise something to satisfy regulators and auditors rather than a core part of how the business is run. While this approach may reduce short-term pressure, it often creates long-term risk. True compliance and good governance are not just about rules; they are about building systems that protect the organization, support decision-making, and enable sustainable growth.</p>\r\n<h3 data-start=\"946\" data-end=\"1001\">Why Compliance and Governance Matter More Than Ever</h3>\r\n<p data-start=\"1003\" data-end=\"1296\">Regulatory environments are becoming more complex across sectors, from financial services and fintech to NGOs and public institutions. At the same time, stakeholders investors, partners, donors, and customers are demanding higher standards of transparency, accountability, and data protection.</p>\r\n<p data-start=\"1298\" data-end=\"1364\">Organizations that treat compliance as an afterthought often face:</p>\r\n<ul data-start=\"1365\" data-end=\"1565\">\r\n<li data-start=\"1365\" data-end=\"1411\">\r\n<p data-start=\"1367\" data-end=\"1411\">Increased regulatory and reputational risk</p>\r\n</li>\r\n<li data-start=\"1412\" data-end=\"1465\">\r\n<p data-start=\"1414\" data-end=\"1465\">Weak internal controls and unclear accountability</p>\r\n</li>\r\n<li data-start=\"1466\" data-end=\"1513\">\r\n<p data-start=\"1468\" data-end=\"1513\">Inefficient processes and duplicated effort</p>\r\n</li>\r\n<li data-start=\"1514\" data-end=\"1565\">\r\n<p data-start=\"1516\" data-end=\"1565\">Poor readiness for audits or regulatory reviews</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"1567\" data-end=\"1763\">On the other hand, organizations that invest in strong governance and practical compliance frameworks benefit from clearer decision-making, stronger oversight, and greater trust from stakeholders.</p>\r\n<h3 data-start=\"1765\" data-end=\"1799\">Moving from Policy to Practice</h3>\r\n<p data-start=\"1801\" data-end=\"1986\">One of the most common challenges we see is the gap between policy and reality. Many organizations have well-written policies, but those policies are not embedded into daily operations.</p>\r\n<p data-start=\"1988\" data-end=\"2043\">A practical compliance and governance framework should:</p>\r\n<ul data-start=\"2044\" data-end=\"2306\">\r\n<li data-start=\"2044\" data-end=\"2113\">\r\n<p data-start=\"2046\" data-end=\"2113\">Be aligned with the organization’s size, sector, and risk profile</p>\r\n</li>\r\n<li data-start=\"2114\" data-end=\"2159\">\r\n<p data-start=\"2116\" data-end=\"2159\">Clearly define roles and responsibilities</p>\r\n</li>\r\n<li data-start=\"2160\" data-end=\"2206\">\r\n<p data-start=\"2162\" data-end=\"2206\">Be supported by simple, workable processes</p>\r\n</li>\r\n<li data-start=\"2207\" data-end=\"2251\">\r\n<p data-start=\"2209\" data-end=\"2251\">Include regular monitoring and reporting</p>\r\n</li>\r\n<li data-start=\"2252\" data-end=\"2306\">\r\n<p data-start=\"2254\" data-end=\"2306\">Be understood by staff, not just senior management</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"2308\" data-end=\"2479\">This is where compliance audits and gap assessments are particularly useful. They help organizations understand what is working, what is not, and where the real risks lie.</p>\r\n<h3 data-start=\"2481\" data-end=\"2526\">Key Building Blocks of a Strong Framework</h3>\r\n<p data-start=\"2528\" data-end=\"2594\">A robust approach to compliance and governance typically includes:</p>\r\n<ul data-start=\"2595\" data-end=\"3065\">\r\n<li data-start=\"2595\" data-end=\"2688\">\r\n<p data-start=\"2597\" data-end=\"2688\"><strong data-start=\"2597\" data-end=\"2629\">Clear governance structures:</strong> Defined roles for boards, management, and key committees</p>\r\n</li>\r\n<li data-start=\"2689\" data-end=\"2770\">\r\n<p data-start=\"2691\" data-end=\"2770\"><strong data-start=\"2691\" data-end=\"2730\">Risk-based policies and procedures:</strong> Focused on the areas that matter most</p>\r\n</li>\r\n<li data-start=\"2771\" data-end=\"2885\">\r\n<p data-start=\"2773\" data-end=\"2885\"><strong data-start=\"2773\" data-end=\"2820\">AML/CFT, KYC, and data protection controls:</strong> Especially important in regulated and data-driven environments</p>\r\n</li>\r\n<li data-start=\"2886\" data-end=\"2962\">\r\n<p data-start=\"2888\" data-end=\"2962\"><strong data-start=\"2888\" data-end=\"2924\">Regular reporting and oversight:</strong> To support informed decision-making</p>\r\n</li>\r\n<li data-start=\"2963\" data-end=\"3065\">\r\n<p data-start=\"2965\" data-end=\"3065\"><strong data-start=\"2965\" data-end=\"3000\">Ongoing training and awareness:</strong> So staff understand both the rules and the reasons behind them</p>\r\n</li>\r\n</ul>\r\n<h3 data-start=\"3067\" data-end=\"3119\">The Payoff: Confidence, Credibility, and Control</h3>\r\n<p data-start=\"3121\" data-end=\"3384\">When compliance and governance are done well, they stop being a burden and start becoming a strategic advantage. Organizations gain better control over their operations, greater confidence in their decisions, and stronger credibility with regulators and partners.</p>\r\n<p data-start=\"3386\" data-end=\"3533\">In today’s environment, the question is no longer whether you can afford to invest in governance and compliance it’s whether you can afford not to.</p>', 'No'),
(3, '6770e442cc', 'Risk Management: Making Better Decisions in an Uncertain World', 'risk-management-making-better-decisions-in-an-uncertain-world', 3, 'Pregnancy is a life-changing journey. Understanding antenatal care helps expectant mothers feel confident, informed, and prepared every step of the way.', '<p data-start=\"3642\" data-end=\"3975\">Every organization faces uncertainty. Whether it’s entering a new market, onboarding a new partner, launching a new product, or delivering a major project, risk is always part of the equation. The difference between successful organizations and struggling ones is not the absence of risk it’s how well risk is understood and managed.</p>\r\n<h3 data-start=\"3977\" data-end=\"4022\">Why Risk Management Is a Leadership Issue</h3>\r\n<p data-start=\"4024\" data-end=\"4290\">Risk management is often misunderstood as a purely technical or compliance-driven function. In reality, it is a core leadership and strategy issue. Decisions about growth, partnerships, investments, and operations all involve trade-offs between opportunity and risk.</p>\r\n<p data-start=\"4292\" data-end=\"4349\">Without a structured approach to risk, organizations may:</p>\r\n<ul data-start=\"4350\" data-end=\"4575\">\r\n<li data-start=\"4350\" data-end=\"4405\">\r\n<p data-start=\"4352\" data-end=\"4405\">Be surprised by issues they should have anticipated</p>\r\n</li>\r\n<li data-start=\"4406\" data-end=\"4455\">\r\n<p data-start=\"4408\" data-end=\"4455\">Overcommit resources to high-risk initiatives</p>\r\n</li>\r\n<li data-start=\"4456\" data-end=\"4516\">\r\n<p data-start=\"4458\" data-end=\"4516\">Enter partnerships or transactions with hidden exposures</p>\r\n</li>\r\n<li data-start=\"4517\" data-end=\"4575\">\r\n<p data-start=\"4519\" data-end=\"4575\">React to problems instead of managing them proactively</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"4577\" data-end=\"4718\">Enterprise risk assessments help bring clarity to this complexity by identifying, prioritizing, and evaluating risks across the organization.</p>\r\n<h3 data-start=\"4720\" data-end=\"4757\">The Role of Due Diligence and KYC</h3>\r\n<p data-start=\"4759\" data-end=\"5017\">Due diligence and KYC (Know Your Customer / Counterparty) reviews are critical tools for reducing uncertainty before making key decisions. Whether you are working with a new client, vendor, investor, or partner, these reviews help answer essential questions:</p>\r\n<ul data-start=\"5018\" data-end=\"5214\">\r\n<li data-start=\"5018\" data-end=\"5053\">\r\n<p data-start=\"5020\" data-end=\"5053\">Who are we really dealing with?</p>\r\n</li>\r\n<li data-start=\"5054\" data-end=\"5116\">\r\n<p data-start=\"5056\" data-end=\"5116\">What financial, legal, or reputational risks are involved?</p>\r\n</li>\r\n<li data-start=\"5117\" data-end=\"5166\">\r\n<p data-start=\"5119\" data-end=\"5166\">Are there compliance or regulatory red flags?</p>\r\n</li>\r\n<li data-start=\"5167\" data-end=\"5214\">\r\n<p data-start=\"5169\" data-end=\"5214\">Do the potential rewards justify the risks?</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"5216\" data-end=\"5301\">Good due diligence is not about slowing down decisions it’s about making better ones.</p>\r\n<h3 data-start=\"5303\" data-end=\"5372\">Looking Beyond the Organization: Third-Party and Operational Risk</h3>\r\n<p data-start=\"5374\" data-end=\"5603\">Many of today’s biggest risks do not come from inside the organization, but from third parties and critical processes. Vendors, partners, and outsourced functions can all introduce operational, compliance, and reputational risks.</p>\r\n<p data-start=\"5605\" data-end=\"5673\">Regular third-party and operational risk reviews help organizations:</p>\r\n<ul data-start=\"5674\" data-end=\"5853\">\r\n<li data-start=\"5674\" data-end=\"5721\">\r\n<p data-start=\"5676\" data-end=\"5721\">Understand dependencies and vulnerabilities</p>\r\n</li>\r\n<li data-start=\"5722\" data-end=\"5759\">\r\n<p data-start=\"5724\" data-end=\"5759\">Strengthen oversight and controls</p>\r\n</li>\r\n<li data-start=\"5760\" data-end=\"5805\">\r\n<p data-start=\"5762\" data-end=\"5805\">Improve resilience across the value chain</p>\r\n</li>\r\n<li data-start=\"5806\" data-end=\"5853\">\r\n<p data-start=\"5808\" data-end=\"5853\">Reduce the likelihood of costly disruptions</p>\r\n</li>\r\n</ul>\r\n<h3 data-start=\"5855\" data-end=\"5888\">From Identification to Action</h3>\r\n<p data-start=\"5890\" data-end=\"6165\">Risk management only adds value when it leads to action. This is where internal controls and risk mitigation strategies come in. The goal is not to eliminate risk entirely this is rarely possible but to reduce risk to an acceptable level and ensure it is consciously managed.</p>\r\n<p data-start=\"6167\" data-end=\"6213\">A mature risk approach helps leadership teams:</p>\r\n<ul data-start=\"6214\" data-end=\"6406\">\r\n<li data-start=\"6214\" data-end=\"6272\">\r\n<p data-start=\"6216\" data-end=\"6272\">Make more informed strategic and operational decisions</p>\r\n</li>\r\n<li data-start=\"6273\" data-end=\"6312\">\r\n<p data-start=\"6275\" data-end=\"6312\">Allocate resources more effectively</p>\r\n</li>\r\n<li data-start=\"6313\" data-end=\"6343\">\r\n<p data-start=\"6315\" data-end=\"6343\">Avoid unpleasant surprises</p>\r\n</li>\r\n<li data-start=\"6344\" data-end=\"6406\">\r\n<p data-start=\"6346\" data-end=\"6406\">Build confidence with boards, regulators, and stakeholders</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"6408\" data-end=\"6506\">In an uncertain world, good risk management is not about being cautious it’s about being prepared.</p>', '0641faaa11.webp', 'Yes', '2025-08-20', 'Risk Management: Making Better Decisions in an Uncertain World Pregnancy is a life-changing journey. Understanding antenatal care helps expectant mothers feel confident, informed, and prepared every step of the way. <p data-start=\"3642\" data-end=\"3975\">Every organization faces uncertainty. Whether it’s entering a new market, onboarding a new partner, launching a new product, or delivering a major project, risk is always part of the equation. The difference between successful organizations and struggling ones is not the absence of risk it’s how well risk is understood and managed.</p>\r\n<h3 data-start=\"3977\" data-end=\"4022\">Why Risk Management Is a Leadership Issue</h3>\r\n<p data-start=\"4024\" data-end=\"4290\">Risk management is often misunderstood as a purely technical or compliance-driven function. In reality, it is a core leadership and strategy issue. Decisions about growth, partnerships, investments, and operations all involve trade-offs between opportunity and risk.</p>\r\n<p data-start=\"4292\" data-end=\"4349\">Without a structured approach to risk, organizations may:</p>\r\n<ul data-start=\"4350\" data-end=\"4575\">\r\n<li data-start=\"4350\" data-end=\"4405\">\r\n<p data-start=\"4352\" data-end=\"4405\">Be surprised by issues they should have anticipated</p>\r\n</li>\r\n<li data-start=\"4406\" data-end=\"4455\">\r\n<p data-start=\"4408\" data-end=\"4455\">Overcommit resources to high-risk initiatives</p>\r\n</li>\r\n<li data-start=\"4456\" data-end=\"4516\">\r\n<p data-start=\"4458\" data-end=\"4516\">Enter partnerships or transactions with hidden exposures</p>\r\n</li>\r\n<li data-start=\"4517\" data-end=\"4575\">\r\n<p data-start=\"4519\" data-end=\"4575\">React to problems instead of managing them proactively</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"4577\" data-end=\"4718\">Enterprise risk assessments help bring clarity to this complexity by identifying, prioritizing, and evaluating risks across the organization.</p>\r\n<h3 data-start=\"4720\" data-end=\"4757\">The Role of Due Diligence and KYC</h3>\r\n<p data-start=\"4759\" data-end=\"5017\">Due diligence and KYC (Know Your Customer / Counterparty) reviews are critical tools for reducing uncertainty before making key decisions. Whether you are working with a new client, vendor, investor, or partner, these reviews help answer essential questions:</p>\r\n<ul data-start=\"5018\" data-end=\"5214\">\r\n<li data-start=\"5018\" data-end=\"5053\">\r\n<p data-start=\"5020\" data-end=\"5053\">Who are we really dealing with?</p>\r\n</li>\r\n<li data-start=\"5054\" data-end=\"5116\">\r\n<p data-start=\"5056\" data-end=\"5116\">What financial, legal, or reputational risks are involved?</p>\r\n</li>\r\n<li data-start=\"5117\" data-end=\"5166\">\r\n<p data-start=\"5119\" data-end=\"5166\">Are there compliance or regulatory red flags?</p>\r\n</li>\r\n<li data-start=\"5167\" data-end=\"5214\">\r\n<p data-start=\"5169\" data-end=\"5214\">Do the potential rewards justify the risks?</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"5216\" data-end=\"5301\">Good due diligence is not about slowing down decisions it’s about making better ones.</p>\r\n<h3 data-start=\"5303\" data-end=\"5372\">Looking Beyond the Organization: Third-Party and Operational Risk</h3>\r\n<p data-start=\"5374\" data-end=\"5603\">Many of today’s biggest risks do not come from inside the organization, but from third parties and critical processes. Vendors, partners, and outsourced functions can all introduce operational, compliance, and reputational risks.</p>\r\n<p data-start=\"5605\" data-end=\"5673\">Regular third-party and operational risk reviews help organizations:</p>\r\n<ul data-start=\"5674\" data-end=\"5853\">\r\n<li data-start=\"5674\" data-end=\"5721\">\r\n<p data-start=\"5676\" data-end=\"5721\">Understand dependencies and vulnerabilities</p>\r\n</li>\r\n<li data-start=\"5722\" data-end=\"5759\">\r\n<p data-start=\"5724\" data-end=\"5759\">Strengthen oversight and controls</p>\r\n</li>\r\n<li data-start=\"5760\" data-end=\"5805\">\r\n<p data-start=\"5762\" data-end=\"5805\">Improve resilience across the value chain</p>\r\n</li>\r\n<li data-start=\"5806\" data-end=\"5853\">\r\n<p data-start=\"5808\" data-end=\"5853\">Reduce the likelihood of costly disruptions</p>\r\n</li>\r\n</ul>\r\n<h3 data-start=\"5855\" data-end=\"5888\">From Identification to Action</h3>\r\n<p data-start=\"5890\" data-end=\"6165\">Risk management only adds value when it leads to action. This is where internal controls and risk mitigation strategies come in. The goal is not to eliminate risk entirely this is rarely possible but to reduce risk to an acceptable level and ensure it is consciously managed.</p>\r\n<p data-start=\"6167\" data-end=\"6213\">A mature risk approach helps leadership teams:</p>\r\n<ul data-start=\"6214\" data-end=\"6406\">\r\n<li data-start=\"6214\" data-end=\"6272\">\r\n<p data-start=\"6216\" data-end=\"6272\">Make more informed strategic and operational decisions</p>\r\n</li>\r\n<li data-start=\"6273\" data-end=\"6312\">\r\n<p data-start=\"6275\" data-end=\"6312\">Allocate resources more effectively</p>\r\n</li>\r\n<li data-start=\"6313\" data-end=\"6343\">\r\n<p data-start=\"6315\" data-end=\"6343\">Avoid unpleasant surprises</p>\r\n</li>\r\n<li data-start=\"6344\" data-end=\"6406\">\r\n<p data-start=\"6346\" data-end=\"6406\">Build confidence with boards, regulators, and stakeholders</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"6408\" data-end=\"6506\">In an uncertain world, good risk management is not about being cautious it’s about being prepared.</p>', 'No'),
(4, '840045fedb', 'Why Project Delivery and Capacity Building Matter', 'why-project-delivery-and-capacity-building-matter', 3, 'Strategies, reforms, and initiatives only create value when they are translated into well-managed projects', '<p data-start=\"6610\" data-end=\"6842\">Organizations don’t fail because they lack ideas they fail because they struggle to execute. Strategies, reforms, and initiatives only create value when they are translated into well-managed projects and supported by capable people.</p>\r\n<h3 data-start=\"6844\" data-end=\"6865\">The Execution Gap</h3>\r\n<p data-start=\"6867\" data-end=\"7030\">Many organizations invest significant time and energy in planning, but far less in building the systems and capabilities needed to deliver. The result is familiar:</p>\r\n<ul data-start=\"7031\" data-end=\"7182\">\r\n<li data-start=\"7031\" data-end=\"7067\">\r\n<p data-start=\"7033\" data-end=\"7067\">Projects run late or over budget</p>\r\n</li>\r\n<li data-start=\"7068\" data-end=\"7100\">\r\n<p data-start=\"7070\" data-end=\"7100\">Responsibilities are unclear</p>\r\n</li>\r\n<li data-start=\"7101\" data-end=\"7133\">\r\n<p data-start=\"7103\" data-end=\"7133\">Stakeholders lose confidence</p>\r\n</li>\r\n<li data-start=\"7134\" data-end=\"7182\">\r\n<p data-start=\"7136\" data-end=\"7182\">Good strategies fail to produce real results</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"7184\" data-end=\"7261\">Strong project management and delivery support help close this execution gap.</p>\r\n<h3 data-start=\"7263\" data-end=\"7309\">What Effective Project Delivery Looks Like</h3>\r\n<p data-start=\"7311\" data-end=\"7382\">Successful projects are built on a few simple but critical foundations:</p>\r\n<ul data-start=\"7383\" data-end=\"7638\">\r\n<li data-start=\"7383\" data-end=\"7432\">\r\n<p data-start=\"7385\" data-end=\"7432\">Clear objectives, scope, and success criteria</p>\r\n</li>\r\n<li data-start=\"7433\" data-end=\"7488\">\r\n<p data-start=\"7435\" data-end=\"7488\">Realistic plans, timelines, and resource allocation</p>\r\n</li>\r\n<li data-start=\"7489\" data-end=\"7541\">\r\n<p data-start=\"7491\" data-end=\"7541\">Strong governance and decision-making structures</p>\r\n</li>\r\n<li data-start=\"7542\" data-end=\"7597\">\r\n<p data-start=\"7544\" data-end=\"7597\">Transparent stakeholder communication and reporting</p>\r\n</li>\r\n<li data-start=\"7598\" data-end=\"7638\">\r\n<p data-start=\"7600\" data-end=\"7638\">Active risk and compliance oversight</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"7640\" data-end=\"7783\">Monitoring, evaluation, and execution support ensure that projects stay on track and that issues are addressed early—before they become crises.</p>\r\n<h3 data-start=\"7785\" data-end=\"7831\">Why Capacity Building Is the Missing Piece</h3>\r\n<p data-start=\"7833\" data-end=\"8006\">Even the best project frameworks will fail if people don’t have the skills and confidence to use them. This is why corporate training and capacity building are so important.</p>\r\n<p data-start=\"8008\" data-end=\"8043\">Targeted training in areas such as:</p>\r\n<ul data-start=\"8044\" data-end=\"8215\">\r\n<li data-start=\"8044\" data-end=\"8091\">\r\n<p data-start=\"8046\" data-end=\"8091\">Compliance, risk management, and governance</p>\r\n</li>\r\n<li data-start=\"8092\" data-end=\"8129\">\r\n<p data-start=\"8094\" data-end=\"8129\">Project management and leadership</p>\r\n</li>\r\n<li data-start=\"8130\" data-end=\"8175\">\r\n<p data-start=\"8132\" data-end=\"8175\">Business development and customer service</p>\r\n</li>\r\n<li data-start=\"8176\" data-end=\"8215\">\r\n<p data-start=\"8178\" data-end=\"8215\">Executive and board-level oversight</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"8217\" data-end=\"8298\">…helps organizations build lasting capability, not just deliver one-off projects.</p>\r\n<h3 data-start=\"8300\" data-end=\"8352\">Sustainable Impact Comes from Systems and People</h3>\r\n<p data-start=\"8354\" data-end=\"8425\">The most successful organizations focus on two things at the same time:</p>\r\n<ol data-start=\"8426\" data-end=\"8583\">\r\n<li data-start=\"8426\" data-end=\"8492\">\r\n<p data-start=\"8429\" data-end=\"8492\"><strong data-start=\"8429\" data-end=\"8457\">Delivering results today</strong> through strong project execution</p>\r\n</li>\r\n<li data-start=\"8493\" data-end=\"8583\">\r\n<p data-start=\"8496\" data-end=\"8583\"><strong data-start=\"8496\" data-end=\"8532\">Building capability for tomorrow</strong> through training and institutional strengthening</p>\r\n</li>\r\n</ol>\r\n<p data-start=\"8585\" data-end=\"8755\">This combination creates a virtuous cycle: better skills lead to better delivery, and better delivery builds confidence, credibility, and momentum for future initiatives.</p>\r\n<p data-start=\"8757\" data-end=\"8892\">In the end, sustainable success is not just about having the right strategy it’s about having the systems and people to make it happen.</p>', '1f27a07d3a.webp', 'Yes', '2025-08-08', 'Why Project Delivery and Capacity Building Matter Strategies, reforms, and initiatives only create value when they are translated into well-managed projects <p data-start=\"6610\" data-end=\"6842\">Organizations don’t fail because they lack ideas they fail because they struggle to execute. Strategies, reforms, and initiatives only create value when they are translated into well-managed projects and supported by capable people.</p>\r\n<h3 data-start=\"6844\" data-end=\"6865\">The Execution Gap</h3>\r\n<p data-start=\"6867\" data-end=\"7030\">Many organizations invest significant time and energy in planning, but far less in building the systems and capabilities needed to deliver. The result is familiar:</p>\r\n<ul data-start=\"7031\" data-end=\"7182\">\r\n<li data-start=\"7031\" data-end=\"7067\">\r\n<p data-start=\"7033\" data-end=\"7067\">Projects run late or over budget</p>\r\n</li>\r\n<li data-start=\"7068\" data-end=\"7100\">\r\n<p data-start=\"7070\" data-end=\"7100\">Responsibilities are unclear</p>\r\n</li>\r\n<li data-start=\"7101\" data-end=\"7133\">\r\n<p data-start=\"7103\" data-end=\"7133\">Stakeholders lose confidence</p>\r\n</li>\r\n<li data-start=\"7134\" data-end=\"7182\">\r\n<p data-start=\"7136\" data-end=\"7182\">Good strategies fail to produce real results</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"7184\" data-end=\"7261\">Strong project management and delivery support help close this execution gap.</p>\r\n<h3 data-start=\"7263\" data-end=\"7309\">What Effective Project Delivery Looks Like</h3>\r\n<p data-start=\"7311\" data-end=\"7382\">Successful projects are built on a few simple but critical foundations:</p>\r\n<ul data-start=\"7383\" data-end=\"7638\">\r\n<li data-start=\"7383\" data-end=\"7432\">\r\n<p data-start=\"7385\" data-end=\"7432\">Clear objectives, scope, and success criteria</p>\r\n</li>\r\n<li data-start=\"7433\" data-end=\"7488\">\r\n<p data-start=\"7435\" data-end=\"7488\">Realistic plans, timelines, and resource allocation</p>\r\n</li>\r\n<li data-start=\"7489\" data-end=\"7541\">\r\n<p data-start=\"7491\" data-end=\"7541\">Strong governance and decision-making structures</p>\r\n</li>\r\n<li data-start=\"7542\" data-end=\"7597\">\r\n<p data-start=\"7544\" data-end=\"7597\">Transparent stakeholder communication and reporting</p>\r\n</li>\r\n<li data-start=\"7598\" data-end=\"7638\">\r\n<p data-start=\"7600\" data-end=\"7638\">Active risk and compliance oversight</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"7640\" data-end=\"7783\">Monitoring, evaluation, and execution support ensure that projects stay on track and that issues are addressed early—before they become crises.</p>\r\n<h3 data-start=\"7785\" data-end=\"7831\">Why Capacity Building Is the Missing Piece</h3>\r\n<p data-start=\"7833\" data-end=\"8006\">Even the best project frameworks will fail if people don’t have the skills and confidence to use them. This is why corporate training and capacity building are so important.</p>\r\n<p data-start=\"8008\" data-end=\"8043\">Targeted training in areas such as:</p>\r\n<ul data-start=\"8044\" data-end=\"8215\">\r\n<li data-start=\"8044\" data-end=\"8091\">\r\n<p data-start=\"8046\" data-end=\"8091\">Compliance, risk management, and governance</p>\r\n</li>\r\n<li data-start=\"8092\" data-end=\"8129\">\r\n<p data-start=\"8094\" data-end=\"8129\">Project management and leadership</p>\r\n</li>\r\n<li data-start=\"8130\" data-end=\"8175\">\r\n<p data-start=\"8132\" data-end=\"8175\">Business development and customer service</p>\r\n</li>\r\n<li data-start=\"8176\" data-end=\"8215\">\r\n<p data-start=\"8178\" data-end=\"8215\">Executive and board-level oversight</p>\r\n</li>\r\n</ul>\r\n<p data-start=\"8217\" data-end=\"8298\">…helps organizations build lasting capability, not just deliver one-off projects.</p>\r\n<h3 data-start=\"8300\" data-end=\"8352\">Sustainable Impact Comes from Systems and People</h3>\r\n<p data-start=\"8354\" data-end=\"8425\">The most successful organizations focus on two things at the same time:</p>\r\n<ol data-start=\"8426\" data-end=\"8583\">\r\n<li data-start=\"8426\" data-end=\"8492\">\r\n<p data-start=\"8429\" data-end=\"8492\"><strong data-start=\"8429\" data-end=\"8457\">Delivering results today</strong> through strong project execution</p>\r\n</li>\r\n<li data-start=\"8493\" data-end=\"8583\">\r\n<p data-start=\"8496\" data-end=\"8583\"><strong data-start=\"8496\" data-end=\"8532\">Building capability for tomorrow</strong> through training and institutional strengthening</p>\r\n</li>\r\n</ol>\r\n<p data-start=\"8585\" data-end=\"8755\">This combination creates a virtuous cycle: better skills lead to better delivery, and better delivery builds confidence, credibility, and momentum for future initiatives.</p>\r\n<p data-start=\"8757\" data-end=\"8892\">In the end, sustainable success is not just about having the right strategy it’s about having the systems and people to make it happen.</p>', 'No');

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

DROP TABLE IF EXISTS `blog_categories`;
CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `category_name`) VALUES
(2, 'News'),
(3, 'Insights');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_title` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `featured` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`cat_id`, `cat_title`, `picture`, `featured`) VALUES
(1, 'Starters', '', 'Food'),
(2, 'Meals', '', 'Food');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blog_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `display` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_subscribers`
--

DROP TABLE IF EXISTS `email_subscribers`;
CREATE TABLE IF NOT EXISTS `email_subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `body`) VALUES
(4, 'What services do you provide?', '<p data-start=\"281\" data-end=\"553\">We provide regulatory compliance and governance advisory, risk management and due diligence, project management and delivery support, and corporate training and capacity-building services. Our work combines strategic advice with practical, hands-on implementation support.</p>'),
(2, 'What type of organizations do you work with?', 'We work with organizations across the public and private sectors, including financial services, fintech, NGOs, SMEs, and large enterprises. Our approach is tailored to each client’s size, sector, and regulatory environment.'),
(3, 'Do you only provide advisory services, or do you also support implementation?', 'We do both. In addition to advisory services, we work alongside client teams to support implementation, project delivery, and capacity building to ensure recommendations translate into real, measurable results.'),
(5, 'Can you help us prepare for regulatory audits or reviews?', 'Yes. We support organizations with compliance audits, gap assessments, documentation reviews, and remediation planning to help them prepare for regulatory inspections, audits, and supervisory reviews.'),
(6, 'Do you offer training for staff and leadership teams?', 'Yes. We design and deliver tailored training programmes for staff, management, and boards, covering areas such as compliance, risk management, governance, project management, leadership, and service delivery. Training can be delivered onsite, virtually, or in a hybrid format.'),
(7, 'How do i get started working with you?', 'You can contact us through our website or email to schedule an initial discussion. We’ll take time to understand your needs and propose a practical, tailored approach that fits your objectives, timelines, and budget.');

-- --------------------------------------------------------

--
-- Table structure for table `gallery1`
--

DROP TABLE IF EXISTS `gallery1`;
CREATE TABLE IF NOT EXISTS `gallery1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paragraph` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` varchar(350) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gallery1`
--

INSERT INTO `gallery1` (`id`, `heading`, `paragraph`, `picture`) VALUES
(8, 'Outside', 'Our entrance', '139daa94be.jpeg'),
(7, 'waiting room', 'Our serene waiting room', 'd23ab152ff.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `general_images`
--

DROP TABLE IF EXISTS `general_images`;
CREATE TABLE IF NOT EXISTS `general_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `photo_order` int NOT NULL,
  `picture` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `general_images`
--

INSERT INTO `general_images` (`id`, `photo_order`, `picture`, `size`, `display`) VALUES
(1, 1, 'Home 1', '9ca2848949.png', 'Yes'),
(2, 2, 'Home 2', 'home2.jpg', ''),
(4, 3, 'Home 3', 'home3.jpg', ''),
(5, 4, 'Home 4', 'home4.jpg', ''),
(6, 5, 'Home 5', 'home5.jpg', ''),
(7, 6, 'Home 6', 'home6.jpg', ''),
(8, 7, 'About Header', 'about_header.jpg', ''),
(9, 8, 'About 1', 'd801ec9e7d.png', 'Yes'),
(10, 9, 'About 2', 'about2.jpg', ''),
(11, 10, 'About 3', 'about3.jpg', ''),
(25, 11, 'Team Header', 'team_header.jpg', ''),
(26, 12, 'Services Header', 'services_header.jpg', ''),
(27, 13, 'FAQs Header', 'faqs_header.jpg', ''),
(28, 14, 'Blog Header', 'blog_header.jpg', ''),
(29, 15, 'Contact Header', 'contact_header', ''),
(30, 16, 'Terms Header', 'terms_header.jpg', ''),
(31, 17, 'Privacy Header', 'privacy_header.jpg', '');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `seen` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
CREATE TABLE IF NOT EXISTS `partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `picture` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `partners`
--

INSERT INTO `partners` (`id`, `picture`) VALUES
(2, '8b2ef98357.jpeg'),
(3, 'e56ee9e8b5.jpeg'),
(4, 'da4c2316cd.jpeg'),
(7, '75994d40b3.jpeg'),
(6, 'db2c144920.jpeg'),
(9, '7c8bdcaf6d.jpeg'),
(10, '11a242786e.jpeg'),
(11, '0868aabacd.jpeg'),
(12, 'b260de5e10.jpeg'),
(13, 'f70401c557.jpeg'),
(14, '48d5bf3a51.jpeg'),
(15, 'eb589d832b.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `picture_slider`
--

DROP TABLE IF EXISTS `picture_slider`;
CREATE TABLE IF NOT EXISTS `picture_slider` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paragraph` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` varchar(350) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `picture_slider`
--

INSERT INTO `picture_slider` (`id`, `heading`, `paragraph`, `picture`) VALUES
(7, 'Start Right. Stay Compliant. Grow Sustainably.', 'Florence Walters Consulting helps Nigerian businesses register correctly, get licensed, stay compliant, and grow — from company formation to regulatory licensing, tax, governance, and business advisory, all under one firm.', 'dd5624aa04.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `heading` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `preamble` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unique_id` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `heading` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `preamble` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag1` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag2` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag3` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag4` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `unique_id`, `heading`, `slug`, `preamble`, `body`, `picture`, `tag1`, `tag2`, `tag3`, `tag4`) VALUES
(4, '75ab8ec90f', 'Business Formation & Setup', 'business-formation-setup', 'Get your business officially registered and set up the right way, with the right structure, documents, and foundation from day one.', '<div class=\"service-detail-content\">\r\n\r\n	<div class=\"service-detail-grid\">\r\n\r\n		<!-- Main content -->\r\n		<div class=\"service-detail-main\">\r\n\r\n			<!-- Overview -->\r\n			<section class=\"service-content-section\">\r\n				<div class=\"service-section-label\">\r\n					<span></span>\r\n					Overview\r\n				</div>\r\n\r\n				<h2>What This Service Covers</h2>\r\n\r\n				<div class=\"service-intro-text\">\r\n					<p>\r\n						Getting a business off the ground in Africa involves navigating\r\n						multiple agencies, regulatory bodies, and legal frameworks. It’s\r\n						complex, but it doesn’t have to be your problem to solve.\r\n					</p>\r\n\r\n					<p>\r\n						We take ownership of the process: from choosing the right business\r\n						structure to completing all required registrations and obtaining\r\n						the necessary licences. You stay focused on your business; we\r\n						handle the rest.\r\n					</p>\r\n\r\n					<p>\r\n						By the time we’re done, your business is properly constituted,\r\n						legally compliant, and ready to operate.\r\n					</p>\r\n				</div>\r\n			</section>\r\n\r\n			<!-- Service scope -->\r\n			<section class=\"service-content-section\">\r\n				<div class=\"service-section-label\">\r\n					<span></span>\r\n					Service Scope\r\n				</div>\r\n\r\n				<h2>What We Offer</h2>\r\n\r\n				<div class=\"service-accordion\">\r\n\r\n					<details>\r\n						<summary>\r\n							<span>Corporate Structure Advice</span>\r\n							<span class=\"service-accordion-icon\"></span>\r\n						</summary>\r\n\r\n						<div class=\"service-accordion-body\">\r\n							<p>\r\n								We help you select the most appropriate legal and operational\r\n								structure for your business, taking into account ownership,\r\n								liability, tax obligations, investment plans, and long-term\r\n								growth.\r\n							</p>\r\n						</div>\r\n					</details>\r\n\r\n					<details>\r\n						<summary>\r\n							<span>Business Name &amp; Registration</span>\r\n							<span class=\"service-accordion-icon\"></span>\r\n						</summary>\r\n\r\n						<div class=\"service-accordion-body\">\r\n							<p>\r\n								We manage name availability checks, reservation, incorporation,\r\n								and registration with the appropriate authorities.\r\n							</p>\r\n						</div>\r\n					</details>\r\n\r\n					<details>\r\n						<summary>\r\n							<span>Tax Enrollment</span>\r\n							<span class=\"service-accordion-icon\"></span>\r\n						</summary>\r\n\r\n						<div class=\"service-accordion-body\">\r\n							<p>\r\n								We assist with tax identification, registrations, and other\r\n								required tax enrolments so your business can operate and file\r\n								correctly from the outset.\r\n							</p>\r\n						</div>\r\n					</details>\r\n\r\n					<details>\r\n						<summary>\r\n							<span>Licensing &amp; Permits</span>\r\n							<span class=\"service-accordion-icon\"></span>\r\n						</summary>\r\n\r\n						<div class=\"service-accordion-body\">\r\n							<p>\r\n								We identify the licences and permits applicable to your\r\n								industry and help coordinate the application and approval\r\n								process.\r\n							</p>\r\n						</div>\r\n					</details>\r\n\r\n					<details>\r\n						<summary>\r\n							<span>Shareholding &amp; Governance</span>\r\n							<span class=\"service-accordion-icon\"></span>\r\n						</summary>\r\n\r\n						<div class=\"service-accordion-body\">\r\n							<p>\r\n								We help establish clear ownership arrangements, shareholder\r\n								responsibilities, decision-making processes, and governance\r\n								structures.\r\n							</p>\r\n						</div>\r\n					</details>\r\n\r\n					<details>\r\n						<summary>\r\n							<span>Bank Account Facilitation</span>\r\n							<span class=\"service-accordion-icon\"></span>\r\n						</summary>\r\n\r\n						<div class=\"service-accordion-body\">\r\n							<p>\r\n								We prepare and organise the incorporation and compliance\r\n								documents commonly required when opening a corporate bank\r\n								account.\r\n							</p>\r\n						</div>\r\n					</details>\r\n\r\n				</div>\r\n			</section>\r\n\r\n			<!-- Timeline -->\r\n			<section class=\"service-content-section\">\r\n				<div class=\"service-section-label\">\r\n					<span></span>\r\n					What to Expect\r\n				</div>\r\n\r\n				<h2>A Typical Timeline</h2>\r\n\r\n				<div class=\"service-timeline\">\r\n\r\n					<div class=\"service-timeline-item\">\r\n						<div class=\"service-timeline-marker\">1</div>\r\n\r\n						<div class=\"service-timeline-content\">\r\n							<h3>Consultation &amp; Discovery</h3>\r\n\r\n							<p>\r\n								We meet to understand your business model, goals, and location.\r\n								We advise on the best structure and prepare a clear roadmap.\r\n							</p>\r\n						</div>\r\n					</div>\r\n\r\n					<div class=\"service-timeline-item\">\r\n						<div class=\"service-timeline-marker\">2</div>\r\n\r\n						<div class=\"service-timeline-content\">\r\n							<h3>Documentation Preparation</h3>\r\n\r\n							<p>\r\n								We prepare all required documents, forms, and filings and\r\n								confirm details with you before submission.\r\n							</p>\r\n						</div>\r\n					</div>\r\n\r\n					<div class=\"service-timeline-item\">\r\n						<div class=\"service-timeline-marker\">3</div>\r\n\r\n						<div class=\"service-timeline-content\">\r\n							<h3>Filing &amp; Engagement</h3>\r\n\r\n							<p>\r\n								We submit documents to the relevant agencies and manage all\r\n								follow-up communication on your behalf.\r\n							</p>\r\n						</div>\r\n					</div>\r\n\r\n					<div class=\"service-timeline-item\">\r\n						<div class=\"service-timeline-marker\">4</div>\r\n\r\n						<div class=\"service-timeline-content\">\r\n							<h3>Handover &amp; Onboarding</h3>\r\n\r\n							<p>\r\n								Once registration is complete, we walk you through all your\r\n								documents, obligations, and next steps and answer any questions.\r\n							</p>\r\n						</div>\r\n					</div>\r\n\r\n				</div>\r\n			</section>\r\n\r\n			<!-- Ideal for -->\r\n			<section class=\"service-content-section service-ideal-section\">\r\n				<div class=\"service-section-label\">\r\n					<span></span>\r\n					Ideal For\r\n				</div>\r\n\r\n				<h2>This Service is Right for You if...</h2>\r\n\r\n				<div class=\"service-checklist\">\r\n\r\n					<div class=\"service-checklist-item\">\r\n						<span class=\"service-check-icon\">✓</span>\r\n						<span>\r\n							You\'re launching a new business and want to do it properly\r\n						</span>\r\n					</div>\r\n\r\n					<div class=\"service-checklist-item\">\r\n						<span class=\"service-check-icon\">✓</span>\r\n						<span>\r\n							You\'re restructuring or formalising an existing informal\r\n							operation\r\n						</span>\r\n					</div>\r\n\r\n					<div class=\"service-checklist-item\">\r\n						<span class=\"service-check-icon\">✓</span>\r\n						<span>\r\n							You\'re a foreign investor entering an African market\r\n						</span>\r\n					</div>\r\n\r\n					<div class=\"service-checklist-item\">\r\n						<span class=\"service-check-icon\">✓</span>\r\n						<span>\r\n							You\'ve started the registration process but got stuck\r\n						</span>\r\n					</div>\r\n\r\n					<div class=\"service-checklist-item\">\r\n						<span class=\"service-check-icon\">✓</span>\r\n						<span>\r\n							You want to expand into a new country and need to register locally\r\n						</span>\r\n					</div>\r\n\r\n				</div>\r\n			</section>\r\n\r\n		</div>\r\n\r\n		<!-- Sidebar -->\r\n		<aside class=\"service-detail-sidebar\">\r\n\r\n			<div class=\"service-sidebar-inner\">\r\n\r\n				<div class=\"service-consultation-card\">\r\n					<h3>Let\'s help your business get it right</h3>\r\n\r\n					<p>\r\n						Book a free consultation today. We\'ll listen, understand your\r\n						situation, and show you exactly how we can help.\r\n					</p>\r\n\r\n					<a href=\"/contact\" class=\"service-sidebar-button primary\">\r\n						<span>Book Consultation</span>\r\n						<span aria-hidden=\"true\">→</span>\r\n					</a>\r\n\r\n					<a href=\"/contact\" class=\"service-sidebar-button secondary\">\r\n						Contact Us\r\n					</a>\r\n				</div>\r\n\r\n				<div class=\"service-testimonial-card\">\r\n					<div class=\"service-testimonial-author\">\r\n						\r\n\r\n						<div>\r\n							<h4>Nkechi Adeyemi</h4>\r\n							<span>Founder, LumiHealth Clinics</span>\r\n						</div>\r\n					</div>\r\n\r\n					<blockquote>\r\n						“We had been operating without proper regulatory oversight for\r\n						years. Florence\'s team identified the gaps, fixed them, and gave us\r\n						a compliance framework that actually works.”\r\n					</blockquote>\r\n\r\n					<div class=\"service-testimonial-stars\" aria-label=\"Five out of five stars\">\r\n						<span>★</span>\r\n						<span>★</span>\r\n						<span>★</span>\r\n						<span>★</span>\r\n						<span>★</span>\r\n					</div>\r\n				</div>\r\n\r\n			</div>\r\n\r\n		</aside>\r\n\r\n	</div>\r\n\r\n</div>', 'fd34fe1e44.jpg', 'Company Incorporation', 'Business Structuring', 'Corporate Docs', 'Startup Advisory'),
(6, '49ef08ad6e', 'Compliance, Governance & Risk', 'compliance-governance-risk', 'Stay on the right side of the law. We help you meet regulatory requirements, protect your data, and manage risk before it becomes a problem.', '<p data-start=\"245\" data-end=\"553\">Successful projects require more than good ideas , they require strong planning, disciplined execution, and consistent oversight. We support organizations to plan, manage, and deliver projects effectively, helping ensure initiatives are completed on time, within scope, and aligned with strategic objectives.</p>\r\n<p data-start=\"555\" data-end=\"836\">Our Project Management & Delivery Support services combine structured project management practices with practical, hands-on support. We work alongside your teams to strengthen coordination, manage risks, and maintain momentum from project initiation through delivery and close-out.</p>\r\n<h3 data-start=\"838\" data-end=\"852\">What We Do</h3>\r\n<p data-start=\"854\" data-end=\"1133\"><strong data-start=\"854\" data-end=\"891\">Project Planning and Coordination</strong><br data-start=\"891\" data-end=\"894\">\r\nWe support the development of clear project plans, timelines, roles, and governance structures. Our work helps ensure objectives are well-defined, resources are aligned, and activities are coordinated effectively across teams and partners.</p>\r\n<p data-start=\"1135\" data-end=\"1425\"><strong data-start=\"1135\" data-end=\"1175\">Stakeholder Management and Reporting</strong><br data-start=\"1175\" data-end=\"1178\">\r\nWe help design and manage stakeholder engagement and reporting frameworks, ensuring the right information reaches the right people at the right time. This improves transparency, decision-making, and accountability throughout the project lifecycle.</p>\r\n<p data-start=\"1427\" data-end=\"1683\"><strong data-start=\"1427\" data-end=\"1473\">Risk and Compliance Oversight for Projects</strong><br data-start=\"1473\" data-end=\"1476\">\r\nWe integrate risk management and compliance considerations into project delivery, helping identify potential issues early and putting controls in place to reduce disruptions, delays, and regulatory exposure.</p>\r\n<p data-start=\"1685\" data-end=\"1942\"><strong data-start=\"1685\" data-end=\"1734\">Monitoring, Evaluation, and Execution Support</strong><br data-start=\"1734\" data-end=\"1737\">\r\nWe provide ongoing monitoring and execution support to track progress, manage issues, and support corrective actions where needed. Our approach helps keep projects focused on outcomes, not just activities.</p>\r\n<h3 data-start=\"1944\" data-end=\"1960\">Our Approach</h3>\r\n<ul data-start=\"1962\" data-end=\"2236\">\r\n<li data-start=\"1962\" data-end=\"2015\">\r\n<p data-start=\"1964\" data-end=\"2015\">Practical, delivery-focused, and results-oriented</p>\r\n</li>\r\n<li data-start=\"2016\" data-end=\"2088\">\r\n<p data-start=\"2018\" data-end=\"2088\">Scaled to fit the size, complexity, and risk profile of your project</p>\r\n</li>\r\n<li data-start=\"2089\" data-end=\"2154\">\r\n<p data-start=\"2091\" data-end=\"2154\">Integrated with governance, risk, and compliance requirements</p>\r\n</li>\r\n<li data-start=\"2155\" data-end=\"2236\">\r\n<p data-start=\"2157\" data-end=\"2236\">Focused on building your team’s delivery capability, not just delivering once</p>\r\n</li>\r\n</ul>\r\n<h3 data-start=\"2238\" data-end=\"2253\">The Outcome</h3>\r\n<ul data-start=\"2255\" data-end=\"2506\">\r\n<li data-start=\"2255\" data-end=\"2311\">\r\n<p data-start=\"2257\" data-end=\"2311\">Clearer project governance and stronger coordination</p>\r\n</li>\r\n<li data-start=\"2312\" data-end=\"2371\">\r\n<p data-start=\"2314\" data-end=\"2371\">Improved delivery discipline and reduced execution risk</p>\r\n</li>\r\n<li data-start=\"2372\" data-end=\"2427\">\r\n<p data-start=\"2374\" data-end=\"2427\">Better visibility of progress, issues, and outcomes</p>\r\n</li>\r\n<li data-start=\"2428\" data-end=\"2506\">\r\n<p data-start=\"2430\" data-end=\"2506\">Higher confidence in achieving project objectives on time and within scope</p></li></ul>', '73159b688e.jpg', 'Regulatory Compliance', 'AML / KYC', 'Data Protection', 'Risk Advisory'),
(10, '37aabb0087', 'Licensing, Tax & Legal Support', 'licensing-tax-legal-support', 'We handle the technical stuff: licences, tax filings, approvals, and intellectual property so you can focus on running your business.', '<p data-start=\"295\" data-end=\"560\">Strong organizations are built on capable people, clear roles, and effective systems. We design and deliver practical training and capacity-building programmes that strengthen workforce capability, improve performance, and support sustainable organizational growth.</p>\r\n<p data-start=\"562\" data-end=\"894\">Our Corporate Training & Capacity Building services focus on real-world application, not just theory. We work with leadership teams and operational staff to tailor programmes that address your specific challenges, regulatory environment, and strategic priorities ensuring learning translates into measurable improvements on the job.</p>\r\n<h3 data-start=\"896\" data-end=\"910\">What We Do</h3>\r\n<p data-start=\"912\" data-end=\"1237\"><strong data-start=\"912\" data-end=\"968\">Compliance, Risk Management, and Governance Training</strong><br data-start=\"968\" data-end=\"971\">\r\nWe deliver targeted training programmes that build understanding of regulatory requirements, risk management practices, and good governance principles. Our sessions are practical, role-focused, and aligned with your organization’s policies and operating environment.</p>\r\n<p data-start=\"1239\" data-end=\"1515\"><strong data-start=\"1239\" data-end=\"1288\">Project Management and Leadership Development</strong><br data-start=\"1288\" data-end=\"1291\">\r\nWe support organizations to strengthen delivery capability and leadership effectiveness through training in project management fundamentals, execution discipline, team leadership, and decision-making in complex environments.</p>\r\n<p data-start=\"1517\" data-end=\"1792\"><strong data-start=\"1517\" data-end=\"1571\">Business Development and Customer Service Training</strong><br data-start=\"1571\" data-end=\"1574\">\r\nWe help teams improve commercial performance and service quality through training in client engagement, business development, relationship management, and service excellence, tailored to your sector and market context.</p>\r\n<p data-start=\"1794\" data-end=\"2081\"><strong data-start=\"1794\" data-end=\"1833\">Executive and Board-Level Briefings</strong><br data-start=\"1833\" data-end=\"1836\">\r\nWe provide focused briefings and workshops for senior management and boards on key topics such as governance, risk, compliance, strategy execution, and regulatory developments designed to support informed oversight and strategic decision-making.</p>\r\n<p data-start=\"2083\" data-end=\"2286\"><strong data-start=\"2083\" data-end=\"2112\">Flexible Delivery Formats</strong><br data-start=\"2112\" data-end=\"2115\">\r\nOur programmes are available <strong data-start=\"2144\" data-end=\"2185\">onsite, virtual, or in hybrid formats</strong>, allowing organizations to choose the approach that best fits their teams, schedules, and locations.</p>\r\n<h3 data-start=\"2288\" data-end=\"2304\">Our Approach</h3>\r\n<ul data-start=\"2306\" data-end=\"2591\">\r\n<li data-start=\"2306\" data-end=\"2374\">\r\n<p data-start=\"2308\" data-end=\"2374\">Practical, context-driven, and focused on real-world application</p>\r\n</li>\r\n<li data-start=\"2375\" data-end=\"2444\">\r\n<p data-start=\"2377\" data-end=\"2444\">Tailored to your organization’s needs, sector, and maturity level</p>\r\n</li>\r\n<li data-start=\"2445\" data-end=\"2520\">\r\n<p data-start=\"2447\" data-end=\"2520\">Designed to build lasting capability, not just deliver one-off training</p>\r\n</li>\r\n<li data-start=\"2521\" data-end=\"2591\">\r\n<p data-start=\"2523\" data-end=\"2591\">Delivered by experienced practitioners with implementation insight</p>\r\n</li>\r\n</ul>\r\n<h3 data-start=\"2593\" data-end=\"2608\">The Outcome</h3>\r\n<ul data-start=\"2610\" data-end=\"2843\">\r\n<li data-start=\"2610\" data-end=\"2668\">\r\n<p data-start=\"2612\" data-end=\"2668\">Stronger skills and clearer understanding across teams</p>\r\n</li>\r\n<li data-start=\"2669\" data-end=\"2724\">\r\n<p data-start=\"2671\" data-end=\"2724\">Improved compliance, governance, and risk awareness</p>\r\n</li>\r\n<li data-start=\"2725\" data-end=\"2781\">\r\n<p data-start=\"2727\" data-end=\"2781\">Better project delivery and leadership effectiveness</p>\r\n</li>\r\n<li data-start=\"2782\" data-end=\"2843\">\r\n<p data-start=\"2784\" data-end=\"2843\">More confident, capable, and performance-driven workforce</p></li></ul>', 'bd5c7d42a1.jpg', 'Industry Licensing', 'Tax Advisory', 'Trademarks', 'Regulatory Approvals'),
(12, 'bde30fc963', 'Business Growth & Operational Support', 'business-growth-operational-support', 'Ready to grow? We help you build better systems, improve operations, and make smarter decisions at every stage of growth.', '<p>content</p>', '3ee5abc913.png', 'Business Advisory', 'Process Improvement', 'Strategy', 'Training');

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
CREATE TABLE IF NOT EXISTS `team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `name`, `position`, `picture`, `link`) VALUES
(1, 'Florence Walters', 'Founder & Principal Consultant', '9a4a32c31d.jpg', 'google.com'),
(2, 'Daniel Okafor', 'Business Consultant', 'fb357d9066.jpg', 'https://linkedin.com'),
(3, 'Amara Bello', 'Strategy and Operations Consultant', '632377a251.jpg', 'https://linkedin.com'),
(4, 'Ola Daniels', 'Senior Consulting Advisor', '4d28931fe1.jpg', 'https://linkedin.com');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `occupation`, `body`, `picture`, `display`) VALUES
(7, 'Andy Drake', 'Business Man', 'The team supported us through a complex compliance and governance review and helped us turn the findings into practical, workable improvements. Their approach was thorough, professional, and focused on real-world results. We are now far better prepared for regulatory reviews and internal oversight', 'fa0f081710.jpg', 'Yes'),
(8, 'Mary Momodu', 'Programmer', 'What stood out was their hands-on approach. They didn’t just advise they worked with our team to strengthen our project management and delivery processes. The result was better coordination, clearer reporting, and much stronger execution across our programmes.', '6703962949.jpg', 'Yes'),
(9, 'Chinesom Njoku', 'Sustainability Lead', 'Their training and capacity-building sessions were highly relevant and practical. Our staff left with a much clearer understanding of compliance, risk, and governance responsibilities, and we’ve already seen improvements in how teams work and make decisions', '8797174fe3.jpg', 'Yes');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
