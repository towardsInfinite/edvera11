import codecs
import re

html = codecs.open('c:/Users/JANMEJAY/Desktop/Edvera1/index.html', 'r', 'utf-8').read()

num_petals = 5
num_lines_per_petal = 20

svg_paths = []
for petal in range(num_petals):
    angle_offset = (360 / num_petals) * petal
    for i in range(num_lines_per_petal):
        rot = angle_offset + (i * 2.5)
        scale_x = 100 + i * 20
        scale_y = 30 + i * 8
        dist = 50 + i * 5
        # Interleave colors: soft lilac to lighter shades
        stroke_color = f'rgb({200 - i*2}, {180 + i*3}, {240 + i})'
        svg_paths.append(f'<ellipse cx="{dist}" cy="0" rx="{scale_x}" ry="{scale_y}" transform="rotate({rot})" fill="none" stroke="{stroke_color}" stroke-width="1.2" opacity="0.6" />')

spiro_group = '\n                '.join(svg_paths)

new_section = f'''    <!-- Who We Are -->
    <section class="section" style="background-color: #FAFCFF; padding: 7rem 0; position: relative; overflow: hidden; border-top: 1px solid var(--border-subtle);">
        
        <!-- Spirograph SVG -->
        <div style="position: absolute; top: 50%; left: 0; transform: translateY(-50%) translateX(-25%); width: 850px; height: 850px; z-index: 1; pointer-events: none;">
            <svg viewBox="-400 -400 800 800" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <g fill="none">
                {spiro_group}
                </g>
            </svg>
        </div>

        <div class="container grid" style="grid-template-columns: 0.8fr 1.2fr; gap: 4rem; align-items: center; position: relative; z-index: 2;">
            <!-- Title Col (Left) -->
            <div class="reveal-on-scroll" style="padding-left: 2rem;">
                <h2 style="font-family: var(--font-serif); font-size: 3.2rem; color: #2D2A32; font-weight: 400; margin: 0; letter-spacing: -0.02em;">Who We Are</h2>
            </div>
            
            <!-- Text Col (Right) -->
            <div class="reveal-on-scroll delay-1" style="max-width: 650px; margin-left: auto;">
                <p style="font-size: 1.05rem; color: #484654; line-height: 1.8; margin-bottom: 2rem; font-weight: 400;">Edvera is run by a small team of educators with professional experience in teaching and mentoring students across school and university levels.</p>
                <p style="font-size: 1.05rem; color: #484654; line-height: 1.8; margin-bottom: 2rem; font-weight: 400;">Our team members come from technical backgrounds including computer science, engineering, and artificial intelligence, and have collectively spent several years working in education and mentorship roles.</p>
                <p style="font-size: 1.05rem; color: #484654; line-height: 1.8; margin-bottom: 2rem; font-weight: 400;">Over time, we have worked with a large number of students, supporting them in developing strong conceptual understanding and academic confidence in both school and higher education settings.</p>
                <p style="font-size: 1.05rem; color: #484654; line-height: 1.8; margin: 0; font-weight: 400;">At this stage, we operate as a focused, independent initiative, prioritizing structured one-on-one learning and consistent teaching methods over individual visibility.</p>
            </div>
        </div>
    </section>'''

pattern = re.compile(r'    <!-- Who We Are -->.*?    <!-- 9. Parents Section -->', re.DOTALL)

if pattern.search(html):
    new_html = pattern.sub(new_section + '\n\n    <!-- 9. Parents Section -->', html)
    codecs.open('c:/Users/JANMEJAY/Desktop/Edvera1/index.html', 'w', 'utf-8').write(new_html)
    print("Success modifying Who We Are section.")
else:
    print("Pattern not found in index.html")
