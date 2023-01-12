import { Ders } from './../../models/Ders';
import { HotToastService } from '@ngneat/hot-toast';
import { FbservisService } from './../../services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mevcutDersler: Ders[] = [];
  eskiDersler: Ders[] = [];
  frm: FormGroup = new FormGroup({
    baslik: new FormControl(),
    aciklama: new FormControl(),
    tamam: new FormControl()
  });
  constructor(
    public fbservis: FbservisService,
    public htoast: HotToastService
  ) { }

  ngOnInit() {
    this.DersListele();
    this.fbservis.aktifUye.subscribe(d => {
      console.log(d);
    });
  }
  DersListele() {
    this.fbservis.DersListele().subscribe(d => {
      this.mevcutDersler = d.filter(s => s.tamam == false || s.tamam == null);
      this.eskiDersler = d.filter(s => s.tamam == true);
    });
  }
  Kaydet() {
    // console.log(this.frm.value);
    this.fbservis.DersEkle(this.frm.value)
      .pipe(
        this.htoast.observe({
          success: 'Sınav Eklendi',
          loading: 'Sınav Ekleniyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe();
  }
  Sil(ders: Ders) {
    this.fbservis.DersSil(ders).then(() => {

    });
  }
  TamamIptal(ders: Ders, d: boolean) {
    ders.tamam = d;
    this.fbservis.DersDuzenle(ders).then(() => {

    });
  }
}
