#!/usr/bin/env node
import postcss from 'postcss';
// import loadConfig from 'postcss-load-config';
import { mkdirp,existsSync,statSync, readFile, writeFile,readdirSync , ensureDir } from 'fs-extra';
import {basename, dirname, extname, join, parse as parsePath, normalize,relative, resolve} from 'path';
import autoprefixer from 'autoprefixer';
import postcssSass from '@csstools/postcss-sass';
import scss from 'postcss-scss';
import atImport  from 'postcss-import';
import { paths } from "./constants";
import { StyleOpts } from "./types";
import {  resolveApp } from "./utils";
 
const inDir = paths.appSrc || resolveApp('src');
const outDir =paths.appDist || resolveApp('lib'); 
const encoding = 'utf8'; 
 
export function loadPostCssConfig(){
    let cssConfig = {
        map: {
            sourcesContent: false,
            annotation: true
            },
            customSyntax: scss,
            parser: scss,
            plugins: [ 
            postcssSass({
                includePaths: [join(__dirname, 'node_modules')],
                outputStyle: process.env.CSS_MINIFY === '0' ? 'expanded' : 'compressed'
            }),
            autoprefixer(),
            ]
    };
    
    if (existsSync(paths.postcssConfig)) {
        cssConfig = require(paths.postcssConfig);
    }
    return cssConfig;
     
}

let postCssConfig = loadPostCssConfig();

 

const bundleNames: any = {
    'index.scss': 'index'
};

function readDirectory(dir:string, findFiles:string[] = [],maxDeep:number=0): string[] {
    if(maxDeep>8){
      return findFiles;
    }
    let files = readdirSync(dir);
      files.forEach((file:string) => { 
      let filepath1 = join(`${dir}` as string, file);
      let stat = statSync(filepath1);
      if(stat.isFile()){ 
       if(extname(file) === ".scss" && !basename(file).startsWith("_")){
        findFiles.push(join(`${dir}` as string, file));
       }
      }else{
        maxDeep++;
        readDirectory(filepath1, findFiles);
      }
    });
    return findFiles;
  }
 

 function getInputFiles(): string[] {  
  let inputFiles: string[] =  readDirectory(`${inDir}`); 
  return inputFiles; 
}

export async function compilerStyle(styleOpts: StyleOpts): Promise<void> {
  try {
    const { plugins, ...config } = postCssConfig ;
    console.log('files outDir ',JSON.stringify(outDir));   
    const files: string[] =  getInputFiles(); 
    console.log('files style ',JSON.stringify(files)); 
 
    const tasks = files.map(async from => {
      console.log('path style '+from);
      const p =  normalize(from).replace(inDir,outDir);
      const to = join(dirname(p), `${parsePath(p).name}.css`); 
      console.log('outpath   ', to); 
      await  ensureDir(dirname(to)); 
      const css = await readFile(from, encoding) ;
   
      const result = await postcss(plugins)
      .use(atImport)
      .process(css, {
        ...config,
        from, 
        to
      }); 
      await Promise.all([
        writeFile(to, result.css, { 
          encoding: encoding,
          flag:'-w' }) 
      ]) 
    });

    await Promise.all(tasks); 
  } catch (error) {
    console.error(error);
  }
}

