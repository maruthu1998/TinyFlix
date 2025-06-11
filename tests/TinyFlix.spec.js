const { test, expect } = require('@playwright/test');

test.describe('Video Player Tests', () => {
  test('Verify that the video player loads successfully', async ({ page }) => {
    await page.goto('http://localhost:5173/'); // Open the URL(Change your local URL)
    await page.title('TinyFlix'); //Verify the title of the page
  });

  test('Verify that the play button starts video playback', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const playButton = page.locator('img[alt="Thumbnail for Advanced React"]');
    await playButton.click();
    const videoPlayer = page.locator('video');
    await expect(videoPlayer).toHaveJSProperty('paused', false); //Verify that the video started play
  });

  test.only('Verify that the pause button stops video playback', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const playButton = page.locator('button[aria-label="Play"]');
    await playButton.click();
    const pauseButton = page.locator('button[aria-label="Pause"]');
    await pauseButton.click();
    const videoPlayer = page.locator('video');
    await expect(videoPlayer).toHaveJSProperty('paused', true);
  });

  test('Verify that the mute button silences the video', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const muteButton = page.locator('button[aria-label="Mute"]');
    await muteButton.click();
    const videoPlayer = page.locator('video');
    await expect(videoPlayer).toHaveJSProperty('muted', true);
  });

  test('Verify that the unmute button restores the sound', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const muteButton = page.locator('button[aria-label="Mute"]');
    await muteButton.click();
    const unmuteButton = page.locator('button[aria-label="Unmute"]');
    await unmuteButton.click();
    const videoPlayer = page.locator('video');
    await expect(videoPlayer).toHaveJSProperty('muted', false);
  });

  test('Verify that the fullscreen button enables fullscreen mode', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const fullscreenButton = page.locator('button[aria-label="Fullscreen"]');
    await fullscreenButton.click();
    await expect(page).toHaveJSProperty('fullscreenElement', true);
  });

  test('Verify that the exit fullscreen button exits fullscreen mode', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const fullscreenButton = page.locator('button[aria-label="Fullscreen"]');
    await fullscreenButton.click();
    const exitFullscreenButton = page.locator('button[aria-label="Exit Fullscreen"]');
    await exitFullscreenButton.click();
    await expect(page).toHaveJSProperty('fullscreenElement', null);
  });

  test('Verify that the progress bar allows seeking within the video', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const progressBar = page.locator('input[type="range"]'); // Assuming progress bar is a range input
    await progressBar.fill('50'); // Seek to 50%
    const videoPlayer = page.locator('video');
    const duration = await videoPlayer.evaluate((video) => video.duration);
    const currentTime = await videoPlayer.evaluate((video) => video.currentTime);
    expect(currentTime).toBeCloseTo(duration / 2, 1);
  });

  test('Verify that the volume slider adjusts the volume level', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const volumeSlider = page.locator('input[type="range"][aria-label="Volume"]');
    await volumeSlider.fill('0.5'); // Set volume to 50%
    const videoPlayer = page.locator('video');
    const volume = await videoPlayer.evaluate((video) => video.volume);
    expect(volume).toBeCloseTo(0.5, 1);
  });

  test('Verify that the video displays correct current time and duration', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const videoPlayer = page.locator('video');
    const duration = await videoPlayer.evaluate((video) => video.duration);
    const currentTime = await videoPlayer.evaluate((video) => video.currentTime);
    expect(duration).toBeGreaterThan(0);
    expect(currentTime).toBeGreaterThanOrEqual(0);
  });

  test('Verify that captions can be enabled and displayed', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const captionsButton = page.locator('button[aria-label="Enable Captions"]');
    await captionsButton.click();
    const captions = page.locator('.captions'); // Assuming captions have a specific class
    await expect(captions).toBeVisible();
  });
});

test.describe('Comment Functionality Tests', () => {
  test('Verify that a valid comment can be submitted', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const commentInput = page.locator('textarea[aria-label="Comment text"]');
    await commentInput.fill('This is a valid comment.');
    const submitButton = page.locator('button[aria-label="Post comment"]');
    await submitButton.click();
    const comment = page.locator('.comment').last();
    await expect(comment).toContainText('This is a valid comment.');
  });

  test('Verify that the comment input field resets after successful comment submission', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const commentInput = page.locator('textarea[aria-label="Comment text"]');
    await commentInput.fill('Another valid comment.');
    const submitButton = page.locator('button[aria-label="Post comment"]');
    await submitButton.click();
    await expect(commentInput).toHaveValue('');
  });

  test('Verify that a loading spinner appears during buffering', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const videoPlayer = page.locator('video');
    await videoPlayer.evaluate((video) => video.pause());
    const spinner = page.locator('.loading-spinner'); // Assuming spinner has a specific class
    await expect(spinner).toBeVisible();
  });

  test('Verify that a "Video not available" message is displayed if the video fails to load', async ({ page }) => {
    await page.goto('http://localhost:5173/?video=invalid'); // Simulate invalid video
    const errorMessage = page.locator('.error-message'); // Assuming error message has a specific class
    await expect(errorMessage).toHaveText('Video not available');
  });

  test('Verify that rapid comment submissions do not break the UI', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const commentInput = page.locator('textarea[aria-label="Comment text"]');
    await commentInput.fill('Rapid comment.');
    const submitButton = page.locator('button[aria-label="Post comment"]');
    await Promise.all([
      submitButton.click(),
      submitButton.click(),
      submitButton.click(),
    ]);
    const comments = page.locator('.comment');
    await expect(comments).toHaveCount(1); // Only one comment should be submitted
  });
});