import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-cards-slider',
  templateUrl: './cards-slider.component.html',
  styleUrls: ['./cards-slider.component.scss']
})
export class CardsSliderComponent implements OnInit {

  title1 = "El titulo de la primera ves qu ibas a venis";
  content1 = "This is the content of the card que can prove enbasd ghuiad ojsdf khjxdgf xkfg lkjh lfhxkc gfkxhcvb xjhbc vkjxhcxc bxlkjch bxhv zdfgdsfg  fg dfvh dsgfh fghj dzfgd fg dgfh hfdzf fgh dfgh zdfgdfgg d fdf hfhjxcv gfhg hdvhg";

  title2 = "El titulo de la primera ves qu ibas a venis";
  content2 = "This is the content of the card que can prove enbasd ghuiad ojsdf khjxdgf xkfg lkjh lfhxkc gfkxhcvb xjhbc vkjxhcxc bxlkjch bxhv zdfgdsfg  fg dfvh dsgfh fghj dzfgd fg dgfh hfdzf fgh dfgh zdfgdfgg d fdf hfhjxcv gfhg hdvhg";
  
  title3 = "El titulo de la primera ves qu ibas a venis";
  content3 = "This is the content of the card que can prove enbasd ghuiad ojsdf khjxdgf xkfg lkjh lfhxkc gfkxhcvb xjhbc vkjxhcxc bxlkjch bxhv zdfgdsfg  fg dfvh dsgfh fghj dzfgd fg dgfh hfdzf fgh dfgh zdfgdfgg d fdf hfhjxcv gfhg hdvhg";
  
  slideIndex = 1;
  centralPos = 8;
  constructor() { }

  ngOnInit() {
    // this.showSlides(this.slideIndex);
    // timer(10000,10000).subscribe(x => {
    //   if (this.slideIndex > 3){
    //     this.slideIndex = 0
    //   }
    //   this.slideIndex += 1;
    //   this.showSlides(this.slideIndex);
    // });
  }



  plusSlides(n: number) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n: number) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: number) {
    var i,
    slides = document.getElementsByClassName("mySlides");
    // dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
      this.slideIndex = 1
    }
    if (n < 1) {
      this.slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].setAttribute("style", "transform: scale(0.8);");
    }
    // for (i = 0; i < dots.length; i++) {
    //   dots[i].className = dots[i].className.replace(" active", "");
    // }
    slides.item(this.slideIndex - 1).setAttribute("style", "transform: scale(1);");
    // dots.item(this.slideIndex - 1).className += " active";
    if (n ==  1){
      this.centralPos = 10;
    }else{
      this.centralPos = this.centralPos + 20;
    }
    document.getElementById("container").setAttribute("style", "transform: translateX(-"+ this.centralPos +"%);");
  }

}
