# lhua6101_IDEA9103_tut1(Jared)_Group D
## Individual part: Audio
### Instruction
- **Bird sfx will play when start.**
- **Wave and Cloud will move across the screen constantly when start.**
- **Click on the sun:**
    - The sky will turn darker and start to rain.
    - Rain sfx will start play at the same time.
- **Click on the "Play" button:**
    - Wave and house will change their length based on the Wind sfx.
    - Wind sfx will play after click.
    - The raindrop will change its length based on the sfx (it will show more obviously then Wind sfx start playing).
- **Click again on the sun or the "Pause" button:** 
    - Relevant animation and sfx will stop.
    - Birds sfx will be back.
- **The canva size can be adjusted based on the window size.**
 
### Inspiration
![Image of Vaporwave](https://miro.medium.com/v2/resize:fit:1200/format:webp/1*J6CGGxE0zVd9IcqKvtiivg.png)
(Emrantraut, 2020)

Based on the nostalgic aspects of pop culture from the 1980s and 1990s, ***VAPERWAVE*** incorporates elements of light jazz, lounge music, and Internet-era aesthetics such as early Internet visuals, mutant art, and retro-futuristic themes. 

I used this aesthetic for the piece's background. The piece's original sky was composed of color blocks that progressively turned from blue to orange. Every color block was separated by me. This design is more aesthetically pleasing and can simply reflect the shifting hues of the sky in the background. 

![Image of Vaporwave](https://cdn.shopify.com/s/files/1/0001/8857/9891/files/Ud8CIWVMrA0bBrsb-636927419544547110-min_large.jpg?v=1562235671)
(Özer, 2019)

### Animation

By using color blocks and shapes to create a still image, the original group codes recreate the Claude Monet's artwork. 

In the individual section, I concentrate on ***AUDIO***, which combines the audio files with the screen image. I decided to incorporate three sound effects (sfx) into my work rather than a whole song of music. **WindSound**, **RainSound**, and **BirdSound** are their names. I attempt to depict the scene's changing weather because the original artwork depicts the location's sunrise.

#### Waves
Frequency shifts in the audio spectrum power the animation effects in BauhausLine, creating a visual effect that reacts dynamically to sound. Each line's length varies continuously based on the audio's frequency value, becoming longer at high frequencies and shorter at low ones. This variation gives the image a rhythmic fluctuating effect by allowing the lines' length and color to fluctuate in time with the music's frequency and rhythm.

Additionally, BauhausLine creates the illusion of continuous flow by moving horizontally across the canvas, with each line sliding at random speeds from left to right before automatically returning to the opposite side when it crosses the canvas's edge. All things considered, this effect produces a dynamic image full of rhythm and tempo by enabling the lines to shift and move across the canvas on a regular basis, much like a visual representation of music.

#### Raindrops
The animation effect of the raindrop mimics the motion of raindrops naturally falling from the top of the screen. The frequency and volume of the audio subtly alters the random rate at which each raindrop falls. The rain gets denser and there are more raindrops as the volume rises. Each raindrop's shape keeps its narrow width, but its length dynamically adapts to the sound spectrum, giving the drops a more layered and visually varied appearance.

The light, staggered falling effect is created by the various locations of these raindrops. A delicate and continuous rain curtain effect permeates the entire image as the raindrops fall from the sky, slowly vanish after reaching the bottom of the canvas, and then reappear repeatedly. The picture is made more immersive by the raindrops' erratic, dynamic falling movement, which mimics the sound's rhythm and gives the impression that the viewer is actually in a real downpour.

### Technical Explanation
This project employs p5.js to create an animated scene with Bauhaus influences that is enhanced by sound-responsive features. Raindrops that alter their volume, a dynamic BauhausLine object that changes in response to changes in audio frequency, and interactive elements like clouds, buildings, and the sun that interact to produce various sound and visual effects are among the main animations.

#### Main components
- **Sound Analysis: p5.FFT and p5.Amplitude**

	- p5.FFT: Used to examine the waterSound audio spectrum. The BauhausLine object's length and color are mapped to the audio's frequency values, creating a visual effect that matches the audio's rhythm. 

    - p5.Amplitude: monitors the volume level so that the program can modify the quantity of raindrops in accordance with the level. Greater volume levels create a greater rain effect by increasing the number of raindrops.

- **BauhausLine Animation Effects**

	- Every BauhausLine object will change its length in response to changes in audio frequency; a high frequency will make the line longer, and a low frequency will make it shorter, producing a fluctuating effect.

    - In order to produce a continuous flow effect, the BauhausLine object will also move horizontally across the canvas and loop around the edges. Each line's movement speed is chosen at random to create visual variation.


- **Raindrop Animation**

	- Raindrops are dynamically generated at the top of the canvas and fall at different speeds. The number of raindrops generated per frame depends on the volume level, making the rain more intense as the volume increases.

	- The width of each raindrop is kept constant and only the height is varied to add visual hierarchy.

- **Interactive Effects**

	- Sun Interaction: Click on the sun to toggle the rain effect. When it rains, rainSound is played and birdSound is stopped. when rainSound is turned off, birdSound is played again.

	- Sound Toggle Button: Control the play and pause of waterSound with the button. When waterSound is playing, the clouds will disappear; when it is paused, the clouds will reappear.

### Reference
Emrantraut (2020, August 11). History of Vaporwave - Emrantraut - Medium. *Medium*. https://medium.com/@agoraroad/history-of-vaporwave-99f77ae12f8f

Özer, B. S. (2019, July 8). *What is Vaporwave -  Eveything About Genre and History.* Newretro.Net. https://newretro.net/blogs/main/what-is-vaporwave-eveything-about-genre