// Variaveis globais da fórmula do F e G Simplex 2D
var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
var G2 = (3.0 - Math.sqrt(3.0) / 6.0);
// Variaveis globais da fórmula do F e G Simplex 3D
var F3 = 1/3;
var G3 = 1/6;

function VT(xE,yE,zE){ // Função para crição dos vertices
  return {x : xE, y : yE, z : zE}
}

function 3D(xIni, yIni, zIni) {
  var n0, n1, n2, n3; // Cantos da forma

  // Gradientes
  var grid[] = {VT(1,1,0), VT(-1,1,0), VT(1,-1,0), VT(-1,-1,0),
                VT(1,0,1), VT(-1,0,1), VT(1,0,-1), VT(-1,0,-1),
                VT(0,1,1), VT(0,-1,1), VT(0,1,-1), VT(0,-1,-1)}

  var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,89,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

  // Dobra o tamanho de permutação da tabela
  var perm = new Array(512);
  var gradP = new Array(512);

  var s = (xIni + yIni + zIni) * F3; // Fator "Cabeludo" 2D
  var i = Math.floor(xIni + s);
  var j = Math.floor(yIni + s);
  var k = Math.floor(zIni + s);

  var t = ( i + j + k) * G3;
  // Distancias x,y,z da célula de origem
  var x0 = xIni - i + t;
  var y0 = yIni - j + t;
  var z0 = zIni - k + t;

  // 3D utiliza uma forma geometrica de tetraedro
  var i1, j1, k1; // Offset do segundo canto do simplex em coordenada x,i,z
  var i2, j2, k2; // Offset do terceiro canto do simplex em coordenada x,i,z

  // Não faço a minima ideia doque tem aqui, só segui a formula
  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    }else if (x0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j2 = 0;
      k2 = 1;
    }else {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 1;
      j2 = 0;
      k2 = 1;
    }
  }else{
    if (y0 < z0) {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    }else if (x0 < z0) {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    }else{
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    }
  }

  var x1 = x0 - i1 + G3; // Offset do segundo canto
  var y1 = y0 - j1 + G3;
  var z1 = z0 - k1 + G3;

  var x2 = x0 - i2 + 2 * G3; // Offset do terceiro canto
  var y2 = y0 - j2 + 2 * G3;
  var z2 = z0 - k2 + 2 * G3;

  var x3 = x0 - 1 + 3 * G3; // Offset do quarto ponto
  var y3 = y0 - 1 + 3 * G3;
  var z3 = z0 - 1 + 3 * G3;

  // Trabalha no hash dos indices do gradiente dos 4 cantos do simplex
  i &= 255;
  j &= 255;
  k &= 255;
  var gi0 = gradP[i +      perm[j +      perm[k     ]]];
  var gi1 = gradP[i + i1 + perm[j + j1 + perm[k + k1]]];
  var gi2 = gradP[i + i2 + perm[j + j2 + perm[k + k2]]];
  var gi3 = gradP[i +  1 + perm[j +  1 + perm[k  + 1]]];

  // Calcula a contribuição dos 4 Cantos
  var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
  if (t0 < 0) {
    n0 = 0;
  }else{
    t0 *= t0;
    n0 = t0 * t0 * gi0.VT(x0, y0, z0);
  }

  var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
  if (t1 < 0) {
    n1 = 0;
  }else{
    t1 *= t1;
    n1 = t1 * t1 * gi1.VT(x1, y1, z1);
  }

  var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
  if (t2 < 0) {
    n2 = 0;
  }else{
    t2 *= t2;
    n2 = t2 * t2 * gi2.VT(x2, y2, z2);
  }

  var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
  if (t3 < 0) {
    n3 = 0;
  }else{
    t3 *= t3;
    n3 = t3 * t3 * gi3.VT(x3, y3, z3);
  }

  // Retorna o valor final do tetraedro
  return 32 * (n0 + n1 + n2 + n3);
}
