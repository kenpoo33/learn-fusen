'use strict'
{

  // 付箋クラス
  class Fusen {

    constructor() {
      // 設定情報
      this.inColor = iniColor;
      this.inWidth = iniWidth;
      this.inHeight = iniHeight;
      this.margin = margin;
      this.down = false;
      // 要素内のマウスカーソルの相対位置
      this.downRX;
      this.downRY;
      // マウスカーソルの絶対位置
      this.downX;
      this.downY;
      // マウスカーソル押下時のサイズ
      this.downW;
      this.downH;

      // 付箋情報
      this.fid = addFid();
      this.fusen = document.createElement('div');
      this.fusen.classList.add('fusen');
      this.fusen.style.zIndex = addZindex();
      this.fusen.style.background = this.inColor;
      this.fusen.style.position = 'absolute'; // 子要素を中央揃えする為。
      // マウス がエリアに入った場合
      this.fusen.addEventListener('mouseenter', e => {
        this.fusen.style.cursor = this.cursor(e.offsetX, e.offsetY);
      });
      this.fusen.addEventListener('mousedown', e => this.mousedown(e)); //マウス押下

      // 付箋の内部にエリアを作る。
      // 外側にマウスが乗っている場合、伸縮可能とする。
      this.fusenIn = document.createElement('div');
      this.fusenIn.classList.add('inner');
      this.fusenIn.style.background = this.inColor;

      // 付箋のヘッダーエリア
      this.fusenH = document.createElement('div');
      this.fusenH.classList.add('header');
      this.fusenH.addEventListener('mousedown', e => this.mousedownH(e)); //マウス押下
      // 付箋作成ボタン
      this.makeBtn = document.createElement('div');
      this.makeBtn.textContent = '+';
      this.makeBtn.classList.add('btn', 'make');
      // 作成ボタン処理
      this.makeBtn.addEventListener('click', () => {
        main.appendChild(new Fusen());
      });

      // Nowボタン
      this.nowBtn = document.createElement('div');
      this.nowBtn.textContent = 'Now';
      this.nowBtn.classList.add('btn', 'now');
      // nowボタン処理
      this.nowBtn.addEventListener('click', () => {
        this.fusenB.textContent = this.fusenB.textContent + cnvFmtDate(new Date(), 'YYYY年MM月DD日');
      });
      // カラー選択
      this.colorBtn = document.createElement('input');
      this.colorBtn.classList.add('btn', 'color');
      this.colorBtn.setAttribute('type', 'color');
      this.colorBtn.addEventListener('input', (e) => {
        this.fusenB.style.background = this.colorBtn.value;
      });
      // 付箋削除ボタン
      this.delBtn = document.createElement('div');
      this.delBtn.textContent = '×';
      this.delBtn.classList.add('btn', 'delete');
      this.delBtn.addEventListener('click', () => {
        if (document.getElementsByClassName('fusen').length > 1) {
          this.fusen.remove();
        }
      });
      // 付箋の記述エリア
      this.fusenB = document.createElement('div');
      this.fusenB.classList.add('body');
      this.fusenB.style.background = this.inColor;
      this.fusenB.contentEditable = true;  // コンテンツが編集可能

      // 付箋本体に内側を追加
      this.fusenH.appendChild(this.makeBtn);
      this.fusenH.appendChild(this.nowBtn);
      this.fusenH.appendChild(this.colorBtn);
      this.fusenH.appendChild(this.delBtn);
      this.fusenIn.appendChild(this.fusenH);
      this.fusenIn.appendChild(this.fusenB);
      this.fusen.appendChild(this.fusenIn);
      // サイズ設定
      this.setsize();

      return this.fusen;
    }

    // マウスポインターの位置でカーソルを替える。
    cursor = (x, y) => {
      let cursor = 'text';

      if (x < this.margin && y < this.margin) {
        // 左上の角
        cursor = 'nw-resize';
      } else if ((this.inWidth - x) < this.margin && y < this.margin) {
        // 右上の角
        cursor = 'ne-resize';
      } else if ((this.inWidth - x) < this.margin && (this.inHeight - y) < this.margin) {
        // 右下の角
        cursor = 'se-resize';
      } else if (x < this.margin && (this.inHeight - y) < this.margin) {
        // 左下の角
        cursor = 'sw-resize';
      } else if (x < this.margin) {
        // 左辺
        cursor = 'w-resize';
      } else if (y < this.margin) {
        // 上辺
        cursor = 'n-resize';
      } else if ((this.inWidth - x) < this.margin) {
        // 右辺
        cursor = 'w-resize';
      } else if ((this.inHeight - y) < this.margin) {
        // 下辺
        cursor = 's-resize';
      }
      return cursor;
    }
    /*********************************************************************
     *  ヘッダー押下
     * 
     *********************************************************************/
    mousedownH = (e) => {
      e.preventDefault();
      this.fusen.style.zIndex = addZindex();
      this.down = true;
      // マウスが付箋のどの位置を押しているか取得
      this.downRX = e.pageX - this.fusen.getBoundingClientRect().left;
      this.downRY = e.pageY - this.fusen.getBoundingClientRect().top;

      document.addEventListener('mousemove', this.mousemoveH); //マウス移動
      document.addEventListener('mouseup', this.mouseupH); //クリック終わり
    }
    mousemoveH = (e) => {
      if (this.down) {
        // 移動操作
        // fusen.style.left親要素の左上端から、この要素の左上端の差分
        this.fusen.style.left = e.pageX - this.downRX + 'px';
        this.fusen.style.top = e.pageY - this.downRY + 'px';
      }
    }
    mouseupH = (e) => {
      if (this.down) {
        document.removeEventListener('mousemove', this.mousemoveH);
        document.removeEventListener('mouseup', this.mouseupH);
      }
      this.down = false;
    }
    /*********************************************************************
     *  外枠押下
     * 
     *********************************************************************/
    mousedown = (e) => {
      if (!e.target.classList.contains('fusen')) {
        return;
      }
      this.fusen.style.zIndex = addZindex();
      this.down = true;
      // マウスダウン位置
      this.downX = e.pageX;
      this.downY = e.pageY;
      // サイズ変更前の要素サイズ
      this.downW = this.inWidth;
      this.downH = this.inHeight;

      // documentにしないと、マウスを早く動かすと不具合が発生
      document.addEventListener('mousemove', this.mousemove); //マウス移動
      document.addEventListener('mouseup', this.mouseup); //クリック終わり
    }

    mousemove = (e) => {
      if (this.down) {
        // リサイズ操作
        this.inWidth = this.downW + (e.pageX - this.downX);
        this.inHeight = this.downH + (e.pageY - this.downY);
        // 最低サイズより大きい場合
        if (this.inWidth > minWidth && this.inHeight > minHeight) {
          this.setsize();
        }
      }
    }

    mouseup = (e) => {
      if (this.down) {
        document.removeEventListener('mousemove', this.mousemove);
        document.removeEventListener('mouseup', this.mouseup);
      }
      this.down = false;
    }

    setsize = () => {
      this.fusen.style.width = this.inWidth + 'px';
      this.fusen.style.height = this.inHeight + 'px';
      this.fusenIn.style.width = this.inWidth - this.margin + 'px';
      this.fusenIn.style.height = this.inHeight - this.margin + 'px';
      this.fusenH.style.width = this.inWidth - this.margin + 'px';
      this.fusenH.style.height = '30px';
      this.fusenB.style.width = '100%';
      this.fusenB.style.height = this.inHeight - this.margin - 30 + 'px';
    }
  }

  const addFid = () => {
    return fid++;
  }

  // zindexインクリメント
  const addZindex = () => {
    return zindex++;
  }
  //日付フォーマット変換
  const cnvFmtDate = (date, format) => {
    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/MM/, date.getMonth() + 1);
    format = format.replace(/DD/, date.getDate());
    return format;
  }

  // saveする際に使う予定
  const data = {
    id: 0,
    zindex: 0,
    width: 0,
    height: 0,
    text: '',
    color: '',
    positionX: 0,
    positionY: 0
  };

  // 初期設定
  let fid = 0;
  let zindex = 0;
  let iniColor = '#FFF1B0';
  let iniWidth = 200;
  let iniHeight = 300;
  let margin = 10;
  let minWidth = 100;
  let minHeight = 100;
  // save未実装
  const storage = localStorage;
  const main = document.getElementById('main');
  main.appendChild(new Fusen());
}
