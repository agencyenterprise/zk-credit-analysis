
# ZK Credit Score System

![Logo](https://i.ibb.co/rpt77dr/8db82a156d434719bc201fe2f7e980f5.png) 

## **Introduction**
The ZK credit score is a system that is designed to certify a person's ability to obtain a loan without exposing their private data. This system utilizes the power of zero-knowledge (ZK) technology to create a circuit system that is capable of validating the basic conditions required to get a loan.

With the ZK credit score system, borrowers can now be confident that their private data is safe and secure while they are being evaluated for a loan. This is a significant improvement over traditional credit score systems, which often require borrowers to share their sensitive personal information with the banks.

## **Validation Process**
In this version, we added several fields for the loan applicant to fill out, such as their crypto balance, transaction history on the Polygon Mumbai network, and monthly income/expenses. All of this data is used in two machine learning models, which process the data to determine if the loan applicant has a high enough credit score to request the loan.

Our machine learning models use complex algorithms to analyze the data and provide a more accurate credit score. This score validation process is executed on the client-side, specifically on the loan applicant's machine. This innovative approach uses the power of Zero-Knowledge proofs and machine learning (ZKML) to keep all data anonymous, ensuring maximum privacy and security for our clients. We understand that our clients value their privacy, which is why we have implemented this advanced ZKML circuit. With our cutting-edge approach, clients can rest assured that their personal information is safe and secure throughout the loan application process.

## **Technical Notes**
We enjoyed creating this project, which gave us the opportunity to use cutting-edge technologies to ensure privacy and leverage machine learning. We utilized several technologies, including:
- The **zokrates** circuit for producing the first and second ZK proofs
- **keras2circom** for transpiling tensorflow code and generating the final ZK proof and the loan applicant's score
- Saving all ZK proofs and the score in a **Solidity smart contract** in the final stage to ensure immutability.
- Using **Open Zeppelin Defender** for smooth integration with the web3 world.

## **Next steps**
In order to enhance privacy-focused products, we are planning a set of improvements and fixes for our system. First of all, we need to address all security gaps and issues within the system, as we see this as a potential breaking point for growth.

In the second point, our goal is to increase the amount of data provided by loan applicants. We plan to achieve this by adding a feature that allows users to upload official documents in PDF format from the government or bank, using OCR technology to extract the relevant data.

