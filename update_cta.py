import math
import codecs
import re

html_file = 'c:/Users/JANMEJAY/Desktop/Edvera1/index.html'
html = codecs.open(html_file, 'r', 'utf-8').read()

def generate_left_ribbon(num_lines):
    html = ''
    for i in range(num_lines):
        dx1 = math.sin(i * 0.1) * 150
        dx2 = math.cos(i * 0.15) * 200
        y_offset = (i - num_lines/2) * 6
        
        # Base coordinates
        start_x = 100 + dx1
        start_y = -100 + y_offset
        
        c1_x = 300 + dx2
        c1_y = 200 + y_offset * 0.5
        
        c2_x = -100 + dx1
        c2_y = 400 + y_offset * 0.5
        
        end_x = 150 + dx2
        end_y = 800 + y_offset
        
        color = f'rgb({170 + int(math.sin(i*0.1)*30)}, {140 + int(math.cos(i*0.1)*30)}, 220)'
        html += f'<path d="M {start_x:.1f} {start_y:.1f} C {c1_x:.1f} {c1_y:.1f}, {c2_x:.1f} {c2_y:.1f}, {end_x:.1f} {end_y:.1f}" fill="none" stroke="{color}" stroke-width="0.8" opacity="0.6" />\n                '
    return html

def generate_right_ribbon(num_lines):
    html = ''
    for i in range(num_lines):
        dx1 = math.cos(i * 0.12) * 180
        dx2 = math.sin(i * 0.08) * 150
        y_offset = (i - num_lines/2) * 5
        
        start_x = 1100 + dx1
        start_y = -100 + y_offset
        
        c1_x = 1400 - dx2
        c1_y = 200 + y_offset * 0.5
        
        c2_x = 900 + dx1 * 0.5
        c2_y = 450 + y_offset * 0.5
        
        end_x = 1200 + dx2
        end_y = 800 + y_offset
        
        color = f'rgb({170 + int(math.cos(i*0.1)*30)}, {140 + int(math.sin(i*0.1)*30)}, 220)'
        html += f'<path d="M {start_x:.1f} {start_y:.1f} C {c1_x:.1f} {c1_y:.1f}, {c2_x:.1f} {c2_y:.1f}, {end_x:.1f} {end_y:.1f}" fill="none" stroke="{color}" stroke-width="0.8" opacity="0.6" />\n                '
    return html


left_svg = generate_left_ribbon(60)
right_svg = generate_right_ribbon(65)

new_section = f'''    <!-- 11. Primary Conversion Block -->
    <section class="section" style="padding: 10rem 0; text-align: center; background-color: #EFEFEF; position: relative; overflow: hidden;">
        
        <!-- Animated / Parametric Wireframe Ribbons -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;">
            <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; mix-blend-mode: multiply;">
                <!-- Left Twisted Ribbon -->
                <g>
                {left_svg}
                </g>
                
                <!-- Right Twisted Ribbon -->
                <g>
                {right_svg}
                </g>
            </svg>
        </div>

        <div class="container reveal-on-scroll" style="position: relative; z-index: 2;">
            <h2 style="font-family: var(--font-serif); font-size: 3.5rem; color: #2D2A32; font-weight: 400; margin: 0 0 1.5rem 0; letter-spacing: -0.02em;">Begin with a Diagnostic.</h2>
            <p style="max-width: 650px; margin: 0 auto 3rem; font-size: 1.15rem; color: #5B5665; line-height: 1.7; font-weight: 400;">
                Book a 45-minute consultative session to assess your child’s current logical standing and discuss a personalised academic blueprint.
            </p>
            <div class="flex" style="justify-content: center;">
                <a href="#" class="btn js-open-diagnostic" style="background-color: #1A1A1A; color: white; border: none; padding: 1.25rem 2.8rem; font-size: 1rem; font-weight: 500; border-radius: 4px; display: inline-block; cursor: pointer; transition: background-color 0.2s;">Book Free Diagnostic &amp; Placement</a>
            </div>
            <p style="margin-top: 2rem; font-size: 0.95rem; color: #8F8C95;">Restricted intake for quality assurance.</p>
        </div>
    </section>'''

# Make sure we're grabbing exactly the right text block
pattern = re.compile(r'    <!-- 11\. Primary Conversion Block -->.*?    <!-- 12\. Footer -->', re.DOTALL)

if pattern.search(html):
    new_html = pattern.sub(new_section + '\n\n    <!-- 12. Footer -->', html)
    codecs.open(html_file, 'w', 'utf-8').write(new_html)
    print("Success")
else:
    print("Pattern not found")
