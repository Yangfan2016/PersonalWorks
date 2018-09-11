const _baseUrl = 'http://musicapi.duapp.com/api.php';
const _baseUrl2 = 'https://api.imjad.cn/cloudmusic/';
export default{
  getPlayListByWhere (cat,offset,limit,total,order) {
    return _baseUrl + '?type=topPlayList&cat=' + cat + '&offset=' + offset + '&limit=' + limit+'&order='+order+'&total='+total;
  },
  getLrc (id) {
    return _baseUrl2 + '?type=lyric&id=' + id;
  },
  getSong (id) {
    return _baseUrl2 + '?type=url&id=' + id;
  },
  getPlayListDetail (id) {
    return _baseUrl2 + '?type=playlist&id=' + id;
  },
  getMv (id) {
    return _baseUrl2 + '?type=mv&id=' + id;
  },
  search (words) {
    return _baseUrl2 + '?type=search&s=' + words;
  }
};


