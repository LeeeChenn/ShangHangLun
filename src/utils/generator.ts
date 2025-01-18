import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useArticleStoreHook } from '@/store/modules/article';
import { type Article } from '@/store/utils';

export async function generateZip() {
    
    const zip = new JSZip();

    generateArticle(zip);

    // 生成压缩包并下载
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "桂林古本伤寒杂病论.zip");
    });
}

/**
 * 生成原文
 * @param zip 
 */
function generateArticle(zip: JSZip) {
  const list = useArticleStoreHook().getList;
  const root = zip.folder('原文');
  
  let mulu = '\n';
  let index = 1;
  for (const item of list) {
    if (item.pnum && item.pnum >= 21) continue;
    if (item.isList === 1) {
      mulu += '### ' + item.text + '\n\n';
    } else {
      if (item.text.indexOf('伤寒杂病论序') === 0) {
        mulu += '[[0-' + index + ' ' + item.text + '|' + item.text + ']]\n\n';
        index++;
      } else {
        mulu += '[[- ' + item.text + '|' + item.text + ']]\n\n';
      }
    }
  }
  root?.file('桂林古本伤寒杂病论.md', mulu);

  const xu = root?.folder('00.序');
  index = 1;
  for (const item of list) {
      if (item.isList === 1 || item.text.indexOf('伤寒杂病论序') !== 0) continue;
      let articles = getArticles(item);
      let content = '\n';
      for (const article of articles) {
          content += getContent(article, 0);
      }
      xu?.file('0-' + index + ' ' + item.text + '.md', content);
      index++;
  }

  index = 1;
  for (const item of list) {
      if (item.isList === 1 || item.text.indexOf('伤寒杂病论序') === 0 || (item.pnum && item.pnum >= 21)) continue;
      let articles = getArticles(item);
      let order = 1;
      const folder = root?.folder((index < 10 ? '0' + index : index) + '.' + item.text);
      let summary = '\n';
      for (const article of articles) {
          if (article.style === 1) {
            let content = '\n' +  getContent(article, order);
            let name = index + '-' + order;

            summary += '![[' + name + '#' + order.toString().padStart(3, '0') + ']]' + '\n\n';
            folder?.file(name + '.md', content);
            order++;
          }
      }
      folder?.file('- ' + item.text + '.md', summary);
      index++;
  }
}

function getArticles(article: Article): Article[] {
    const articles = useArticleStoreHook().getArticles;
    let ppnum = article.pnum === 0 ? undefined : article.pnum;
    let datas = articles.filter(item => item.pnum === article.num && item.ppnum === ppnum);
    return datas;
}

function getContent(article: Article, order: number): string {
  function getOrder(index: number) {
    return '##### ' + index.toString().padStart(3, '0');
  }

  let content = '';

  if (article.style === 0) {
    content += '##### ' + article.text + '\n';
  } else if (article.style === 2) {
    content += '<p align="right">' + article.text + '</p>';
  } else {
    if (order > 0) {
      content += getOrder(order) + '\n'
    }
    content += article.text.replace(/\\n/g, '\n\n');
  }
  content += '\n';

  return content;
}
