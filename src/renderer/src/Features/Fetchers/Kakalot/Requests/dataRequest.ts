import axios from "axios"


function getMangasKakalot() {
    return async (page) => {
        const response = await axios.get(
            `https://mangakakalot.com/manga_list?type=new&category=all&alpha=all&state=all&group=all&page=${page}`
        );

        return {
            response
        }
    }
}

/* 
ADAPT THIS HERE, TRABALHO DE CORNO
async _getMangas() {
    let request = new Request(this.url + '/seri-listesi?type=text', this.requestOptions);
    let data = await this.fetchDOM(request, 'div#pop-href div[id^=char-] a');
    return data.map(element => {
        return {
            id: this.getRootRelativeOrAbsoluteLink(element, this.url),
            title: element.text.trim()
        };
    });
}

*/

export const KakalotAPI = {
    getMangasKakalot
}