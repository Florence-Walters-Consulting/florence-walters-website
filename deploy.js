import { Client } from 'basic-ftp';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve('.env.deploy') });

const requiredVariables = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'];

const missingVariables = requiredVariables.filter(
	(variableName) => !process.env[variableName],
);

if (missingVariables.length > 0) {
	console.error(
		`Missing deployment configuration: ${missingVariables.join(', ')}`,
	);

	process.exit(1);
}

/*
 * Usage:
 *
 * node deploy.js full
 * node deploy.js react
 * node deploy.js api
 * node deploy.js admin
 * node deploy.js backend
 */
const deploymentMode = process.argv[2] || 'react';

const allowedModes = ['full', 'react', 'api', 'admin', 'backend'];

if (!allowedModes.includes(deploymentMode)) {
	console.error(`Invalid deployment mode: ${deploymentMode}`);

	console.error(`Available modes: ${allowedModes.join(', ')}`);

	process.exit(1);
}

const localDirectories = {
	react: path.resolve('dist'),
	api: path.resolve('api'),
	admin: path.resolve('admin8396'),
	siteImages: path.resolve('site_img'),
};

function getDirectoriesToUpload() {
	switch (deploymentMode) {
		case 'full':
			return [
				{
					name: 'React application',
					localDirectory: localDirectories.react,
					remoteDirectory: '.',
				},
				{
					name: 'API',
					localDirectory: localDirectories.api,
					remoteDirectory: 'api',
				},
				{
					name: 'Admin',
					localDirectory: localDirectories.admin,
					remoteDirectory: 'admin8396',
				},
				{
					name: 'Site images',
					localDirectory: localDirectories.siteImages,
					remoteDirectory: 'site_img',
				},
			];

		case 'react':
			return [
				{
					name: 'React application',
					localDirectory: localDirectories.react,
					remoteDirectory: '.',
				},
			];

		case 'api':
			return [
				{
					name: 'API',
					localDirectory: localDirectories.api,
					remoteDirectory: 'api',
				},
			];

		case 'admin':
			return [
				{
					name: 'Admin',
					localDirectory: localDirectories.admin,
					remoteDirectory: 'admin8396',
				},
			];

		case 'backend':
			return [
				{
					name: 'API',
					localDirectory: localDirectories.api,
					remoteDirectory: 'api',
				},
				{
					name: 'Admin',
					localDirectory: localDirectories.admin,
					remoteDirectory: 'admin8396',
				},
			];

		default:
			return [];
	}
}

function validateDirectories(directories) {
	for (const directory of directories) {
		if (!fs.existsSync(directory.localDirectory)) {
			throw new Error(
				`${directory.name} directory does not exist: ${directory.localDirectory}`,
			);
		}
	}
}

async function removeOldReactAssets(client, remoteRoot) {
	const remoteAssetsDirectory = path.posix.join(remoteRoot, 'assets');

	console.log('Removing previous React assets...');

	try {
		await client.removeDir(remoteAssetsDirectory);
		console.log('Previous React assets removed.');
	} catch {
		console.log('No previous React assets directory found.');
	}
}

async function uploadDirectory(client, directory, remoteRoot) {
	const targetDirectory = path.posix.join(
		remoteRoot,
		directory.remoteDirectory,
	);

	console.log(`Uploading ${directory.name}...`);

	await client.ensureDir(targetDirectory);

	await client.uploadFromDir(directory.localDirectory, targetDirectory);

	console.log(`${directory.name} uploaded successfully.`);
}

async function deploy() {
	const client = new Client(120000);
	const directoriesToUpload = getDirectoriesToUpload();

	try {
		validateDirectories(directoriesToUpload);

		client.ftp.verbose = process.env.FTP_VERBOSE === 'true';

		console.log(`Starting ${deploymentMode} deployment...`);

		console.log('Connecting to FTP server...');

		await client.access({
			host: process.env.FTP_HOST,
			port: Number(process.env.FTP_PORT || 21),
			user: process.env.FTP_USER,
			password: process.env.FTP_PASSWORD,
			secure: true,
			secureOptions: {
				rejectUnauthorized: false,
			},
		});

		const remoteRoot = process.env.FTP_REMOTE_DIRECTORY || '/public_html';

		await client.ensureDir(remoteRoot);

		console.log('Connected successfully.');

		/*
		 * Remove old Vite assets only when the React
		 * application is part of the deployment.
		 */
		if (deploymentMode === 'react' || deploymentMode === 'full') {
			await removeOldReactAssets(client, remoteRoot);
		}

		for (const directory of directoriesToUpload) {
			await uploadDirectory(client, directory, remoteRoot);
		}

		console.log(`${deploymentMode} deployment completed successfully.`);
	} catch (error) {
		console.error(`${deploymentMode} deployment failed:`, error);

		process.exitCode = 1;
	} finally {
		client.close();
	}
}

deploy();
