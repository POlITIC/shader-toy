// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;// Canvas size (width,height)
uniform vec2 u_mouse;// mouse position in screen pixels
uniform float u_time;// Time in seconds since load

#define t u_time
#define r u_resolution

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    float y = -abs(sin(t + st.x * PI * 2.0)) * 0.5 + 0.5;

    float pct = smoothstep( 0.0, t - (floor(t / PI) * PI) , st.x );

    vec3 color = vec3(pct, 0.0, 0.7);

    gl_FragColor = vec4(color, 1.0);
}
