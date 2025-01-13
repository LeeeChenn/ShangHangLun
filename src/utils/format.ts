
export enum ArticleType {
    Title = 0,
    Text = 1,
    Footer = 2,
    RedText = 3,
    Footer2 = 4,
}

export const formatText = (text: string, data: any) => {
    const style = data.style;
    const needOrder = data.ppnum && data.ppnum >=5 && data.ppnum < 21;
    return text.split('\\n').map((line, index) => {
        switch(style) {     
            case ArticleType.Title:
                return `<span key="${index}" class="block text-lg text-gray-800 text-center font-bold">${line}</span>`
            case ArticleType.Text: {
                if (needOrder) {
                    return `
                        <div key="${index}" class="flex text-base text-gray-800">
                            <span class="flex-none w-[6em] text-left">${index === 0 ? '【' + (data.ppnum - 4) + '.' + data.num + '】' : ''}</span>
                            <span class="flex-1">${line}</span>
                        </div>
                        `
                } else {
                    return `<span key="${index}" class="block text-base text-gray-800">${line}</span>`
                }
            }
            case ArticleType.Footer2:
            case ArticleType.Footer:
                return `<span key="${index}" class="block text-base text-gray-800 text-right">${line}</span>`
            case ArticleType.RedText:
                return `<span key="${index}" class="block text-base text-red-800 red">${line}</span>`
            default:    
                return `<span key="${index}" class="block text-base text-gray-800">${line}</span>`
        }
    }).join('');
};