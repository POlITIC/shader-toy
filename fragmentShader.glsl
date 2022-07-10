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

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
    return  smoothstep( pct-0.02, pct, st.y) -
    smoothstep( pct, pct+0.02, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    float y = -abs(sin(t + st.x * PI * 2.0)) * 0.5 + 0.5;

    vec3 color = vec3(y);

    float pct = plot(st, y);

    color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(color, 1.0);
}
