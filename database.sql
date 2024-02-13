-- CREATE DATABASE "aws-file-upload";

-- Table structure
CREATE TABLE "images" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(1000) NOT NULL,
	"type" VARCHAR(50) NOT NULL
);

