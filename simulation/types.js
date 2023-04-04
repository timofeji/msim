// Object that maps each Hanzi character to a color
const types = {
  人: '#ff0000', // person - red
  平: '#8BC34A', // flat terrain - light green
  山: '#5D4037', // mountain terrain - dark brown
  水: '#2196F3', // water terrain - blue
  森: '#1B5E20', // forest terrain - dark green
  草: '#CDDC39', // grassland terrain - light green/yellow
  沙: '#D7CCC8', // desert terrain - light brown
  石: '#BDBDBD', // rocky terrain - gray
  雪: '#FFFFFF', // snowy terrain - white
  土: '#8D6E63', // earthy terrain - brown
  火: '#FF5722', // fiery terrain - red/orange
  云: 'rgba(255, 255, 255, 0.7)', // cloud terrain - white (with transparency to show the terrain beneath)
  仙: '#FFEB3B', // immortal terrain - yellow
  仲: '#795548', // middle terrain - brown
  伊: '#FFEB3B', // that terrain - yellow
  伍: '#795548', // five terrain - brown
  伏: '#BDBDBD', // prostrate terrain - gray
  伐: '#F44336', // cut down terrain - red
  休: '#FFEB3B', // rest terrain - yellow
  会: '#FFEB3B', // meeting terrain - yellow
  伝: '#FFEB3B', // pass on terrain - yellow
  位: '#FFEB3B', // position terrain - yellow
  低: '#BDBDBD', // low terrain - gray
  住: '#BDBDBD', // reside terrain - gray
  佐: '#795548', // assist terrain - brown
  佑: '#FFEB3B', // help terrain - yellow
  体: '#BDBDBD', // body terrain - gray
  何: '#8D6E63', // what terrain - brown
  作: '#795548', // create terrain - brown
  使: '#795548', // use terrain - brown
  侃: '#795548', // speak frankly terrain - brown
  価: '#BDBDBD', // value terrain - gray
  侍: '#795548', // samurai terrain - brown
  侮: '#795548', // insult terrain - brown
  侯: '#795548', // marquis terrain - brown
  侵: '#F44336', // invade terrain - red
  侶: '#795548', // companion terrain - brown
  俊: '#795548', // talented terrain - brown
  俗: '#795548', // vulgar terrain - brown
  俘: '#F44336', // capture terrain - red
  保: '#CDDC39', // protect terrain - light green/yellow
  信: '#8BC34A', // believe terrain - green
  修: '#795548', // repair terrain - brown
}
