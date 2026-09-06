# Storyboard

**Format:** 1080x1920 portrait  
**Audio:** Voiceover-ready script; visual timing works without audio until TTS is generated.  
**VO direction:** Calm, confident Indonesian tech portfolio reel in English, with brief pauses between statements.  
**Style basis:** DESIGN.md using captured palette, fonts, screenshots, project cards, timeline panels, and skill cards.

## Global Direction

Keep the reel dark, sharp, and alive. Every beat uses at least one captured screenshot, neon accent, and continuous motion. Motion should feel like a smooth scroll through a technical portfolio: camera drift, card parallax, timeline scans, and glowing data/circuit details.

## Asset Audit

| Asset | Type | Assign to Beat | Role |
| --- | --- | --- | --- |
| `capture/screenshots/scroll-019.png` | Website screenshot | Beat 1, Beat 2 | About and featured projects reveal |
| `capture/screenshots/scroll-039.png` | Website screenshot | Beat 2 | Project card close-up |
| `capture/screenshots/scroll-058.png` | Website screenshot | Beat 3 | Experience timeline panel |
| `capture/screenshots/scroll-100.png` | Website screenshot | Beat 4, Beat 5 | Skills and contact close |
| `capture/assets/og-image.png` | Portfolio preview image | Beat 1, Beat 5 | Brand preview panel |
| `capture/assets/svgs/skill-card-icon.svg` | SVG icon | Beat 4 | Skill card data icon |
| `capture/assets/svgs/contact-btn.svg` | SVG icon | Beat 5 | Contact/social cue |

## BEAT 1 - SIGNAL OPENER (0:00-0:06)

**VO cue:** "Zacky Muhammad Dinata is building at the intersection of AI, data, and digital design."

**Concept:** The viewer enters a dark AI workspace already in motion. A portfolio screenshot floats like a glass monitor while neon scan lines assemble the ZMDINATA wordmark and availability badge.

**Visual:** Deep black vertical canvas with teal and purple radial glows. The top half carries the name, role stack, and "Available for Hire" badge. The lower half shows `og-image.png` and `scroll-019.png` as tilted stacked panels. Thin circuit lines draw across the background, and small data chips drift near the panels.

**Animation choreography:** Wordmark types in, badge pulses, screenshot panel glides from the right with perspective tilt, neon line draws under the title, particles float slowly.

**Transition:** Cyan/purple wipe sweeps downward into the projects beat.

## BEAT 2 - PROJECT PROOF (0:06-0:12)

**VO cue:** "His work spans data strategy, machine learning fundamentals, NFT art, and web programming."

**Concept:** Three selected works become the proof of range. The website's project cards move forward one by one like a portfolio carousel.

**Visual:** `scroll-039.png` fills the vertical background with a slow Ken Burns move. Three floating cards stack vertically and label "Data Strategy", "NFT Art", and "Web Programming". Small arrow icons and link pills echo the captured UI.

**Animation choreography:** Screenshot zooms 1 to 1.04. Cards cascade upward, labels count in, link pills shimmer from left to right, and the camera eases closer to the project gallery.

**Transition:** Whip-pan left with blur into the experience timeline.

## BEAT 3 - AI ENGINEER TRAJECTORY (0:12-0:19)

**VO cue:** "He is an Information Systems student, a Pijak x IBM SkillsBuild AI Engineer Scholar, and a maker with roots in Web3 illustration."

**Concept:** The experience timeline becomes a path of momentum. Scholarship, data transition, and design roots stack into one professional direction.

**Visual:** `scroll-058.png` appears as a large timeline panel. Three milestone chips orbit the panel: "IBM SkillsBuild", "Data Science", and "NFT Design". A vertical neon rail grows on the left, matching the captured page's timeline.

**Animation choreography:** Timeline rail draws downward, milestone dots pop with glow, panel floats gently, chips orbit a few degrees then settle, and key phrases highlight in cyan.

**Transition:** Blur-through zoom into skills.

## BEAT 4 - SKILL SYSTEM (0:19-0:25)

**VO cue:** "Now the focus is sharper: Python, Scikit-learn, Pandas, research for a SINTA two plus publication, and systems that turn technical logic into useful products."

**Concept:** The skill grid becomes a compact operating system. Data, design, machine learning, and Web3 are presented as connected modules instead of a static list.

**Visual:** `scroll-100.png` forms the base layer. Four recreated skill tiles sit above it in a 2x2 portrait grid with Lucide-style icons and short labels. Data lines connect the cards, and a central cyan pulse travels through the grid.

**Animation choreography:** Cards rise in stagger, icons rotate gently, connector lines draw from center outward, and a pulse travels through each module.

**Transition:** Smooth upward camera move into the final contact beat.

## BEAT 5 - CTA CLOSE (0:25-0:30)

**VO cue:** "Explore the portfolio. Start with the projects, then connect with Zacky."

**Concept:** The reel resolves into a clean portfolio close. The name, role, project CTA, and contact channels lock into one confident frame.

**Visual:** Dark vertical canvas, centered `ZMDINATA`, large "Explore the portfolio", and four contact chips in a 2x2 grid. The final frame shows "Projects | LinkedIn | GitHub | Email".

**Animation choreography:** CTA text slides up, contact chips snap into position with soft bounce, background glow narrows to a cyan line, then everything holds for readability.

**Transition:** Final fade to the dark portfolio background.

## Production Architecture

```
portfolio-video/
├── index.html
├── DESIGN.md
├── SCRIPT.md
├── STORYBOARD.md
└── capture/
    ├── screenshots/
    ├── assets/
    └── extracted/
```
