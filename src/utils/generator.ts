import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useArticleStoreHook } from '@/store/modules/article';
import { useFormulaStoreHook } from '@/store/modules/formula';
import { type Article, type Formula } from '@/store/utils';

export async function generateZip() {
    
    const zip = new JSZip();

    generateRelations();
    generateHerbs(zip);
    generateArticle(zip);
    generateFormula(zip);

    // 生成压缩包并下载
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "桂林古本伤寒杂病论.zip");
    });
}

let formulaArticlesMap: Map<string, string[]> = new Map();
let articleFormulasMap: Map<string, string[]> = new Map();
let herbs: string[] = [];
function generateRelations() {
  const list = useArticleStoreHook().getList;

  let index = 1;
  for (const item of list) {
    if (item.isList === 1 || item.text.indexOf('伤寒杂病论序') === 0 || (item.pnum && item.pnum >= 21)) continue; 
    let articles = getArticles(item);
    let order = 1;
    for (const article of articles) {
      if (article.style === 1) {
        let name = index + '-' + order;
        let fang = article.fang || [];
        for (const f of fang) {
          let articles = formulaArticlesMap.get(f) || [];
          articles.push(name + '#' + order.toString().padStart(3, '0'));
          formulaArticlesMap.set(f, articles);
          // 
          let formulas = articleFormulasMap.get(name) || [];
          formulas.push(f);
          articleFormulasMap.set(name, formulas);
        }
        order++;
      }
    }
    index++;
  }

  let formulas = useFormulaStoreHook().formulas;
  for (const formula of formulas) {
    formula.list.forEach(item => {
      let herb = item[0];
      if (herbs.indexOf(herb) === -1) {
        herbs.push(herb);
      }
    });
  }
}

function generateHerbs(zip: JSZip) {
  let root = zip.folder('本草');
  for (const herb of herbs) {
    root?.file(herb + '.md', '\n');
  }
}

/**
 * 生成方剂
 * @param zip 
 */
function generateFormula(zip: JSZip) {
    const formulas = useFormulaStoreHook().formulas;
    const root = zip.folder('方剂');

    // let mulu = '\n';
    // let letters = [];
    // for (const item of formulas) {
    //   let name = item.Hname || item.name;
    //   let letter = item.letter;
    //   if (letters.indexOf(letter) === -1) {
    //     letters.push(letter);
    //     mulu += '### ' + letter + '\n\n';
    //   }
    //   mulu += '[[' + name + ']]' + '\n\n';
    // }
    // root?.file('- 汤方索引.md', mulu);

    for (const formula of formulas) {
      let name = formula.Hname || formula.name;
      let content = '\n';
      content += '> [! ]\n'; 
      content += '> #### ' + name + '方\n';
      if (formula.list.length > 0) {
        content += '> ';
        for (const item of formula.list) {
          content += '[[' + item[0] + ']]' 
            + ((item[1] || item[2]) ? '<sub>`' + item[1] + (item[2] ? '(' + item[2] + ')' : '') + '`</sub> ' : '');
        }
        content += '\n';
      }
      if (formula.fa) {
        content += '> \n';
        formula.fa.split('\\n').forEach(line => {
          content += '> <sub>*' + line + '*</sub>\n';
        });
      }
      if (formula.zhu) {
        content += '> \n';
        formula.zhu.split('\\n').forEach(line => {
          content += '> `' + line + '`\n';
        });
      }
      content += '\n';
      let orders = formulaArticlesMap.get(name) || [];
      for (const order of orders) {
        content += '![[' + order + ']]' + '\n\n';
      }
      root?.file(name + '.md', content);
    }
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

            // fang
            let formulas = articleFormulasMap.get(name) || [];
            for (const formula of formulas) {
              content += '\n[[' + formula + ']]' + '\n';
            }

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
