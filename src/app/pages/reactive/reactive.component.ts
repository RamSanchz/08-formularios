import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css'],
})
export class ReactiveComponent implements OnInit {
  forma: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validadores: ValidadoresService
  ) {
    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.crearListeners();
  }

  ngOnInit(): void {}

  get pasatiempos(): FormArray {
    return this.forma.get('pasatiempos') as FormArray;
  }

  get nombreNoValido(): boolean {
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }
  get apellidoNoValido(): boolean {
    return (
      this.forma.get('apellido').invalid && this.forma.get('apellido').touched
    );
  }
  get correoNoValido(): boolean {
    return this.forma.get('correo').invalid && this.forma.get('correo').touched;
  }
  get usuarioNoValido(): boolean {
    return (
      this.forma.get('usuario').invalid && this.forma.get('usuario').touched
    );
  }

  get distritoNoValido(): boolean {
    return (
      this.forma.get('direccion.distrito').invalid &&
      this.forma.get('direccion.distrito').touched
    );
  }
  get ciudadNoValido(): boolean {
    return (
      this.forma.get('direccion.ciudad').invalid &&
      this.forma.get('direccion.ciudad').touched
    );
  }

  get pass1NoValido(): boolean {
    return this.forma.get('pass1').invalid && this.forma.get('pass1').touched;
  }

  get pass2NoValido(): boolean {
    const pass1 = this.forma.get('pass1').value;
    const pass2 = this.forma.get('pass2').value;

    return pass1 === pass2 ? false : true;
  }

  crearFormulario(): void {
    this.forma = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(4)]],
        apellido: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            this.validadores.noSanchez,
          ],
        ],
        correo: [
          '',
          [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          ],
        ],
        usuario: ['', , this.validadores.existeUsuario],
        pass1: ['', Validators.required],
        pass2: ['', Validators.required],
        direccion: this.fb.group({
          distrito: ['', Validators.required],
          ciudad: ['', Validators.required],
        }),
        pasatiempos: this.fb.array([]),
      },
      {
        validators: this.validadores.passwordsIguales('pass1', 'pass2'),
      }
    );
  }

  crearListeners() {
    /* en este metodo se busca estar alerta esperando algunos cambios que puedan suceder en el formulario
     , puede ser en cuanto  al status, valor en general o alguno en especifico   */
    this.forma.valueChanges.subscribe((valor) => {
      console.log(valor);
    });

    this.forma.statusChanges.subscribe((status) => {
      console.log(status);
    });

    this.forma.get('nombre').valueChanges.subscribe(console.log);
  }

  cargarDataAlFormulario(): void {
    /* se puede colocar en vez de setValue la palabra reset y asi no sera necesario una estructura por
    defecto sino que los valores que esten se mostraran y los que no pues no */
    this.forma.reset({
      nombre: 'Ramiro',
      apellido: 'Sánchez',
      correo: 'dosek1996@gmail.com',
      pass1: '1234',
      pass2: '1234',
      direccion: {
        distrito: '11',
        ciudad: 'Xalapa',
      },
    });

    /*
    esta seria una manera de cargara valores por defecto dentro de nuestro array de pasatiempos
    ['comer', 'dormir'].forEach((valor) =>
      this.pasatiempos.push(this.fb.control(valor))
    ); */
  }

  agregarPasatiempo(): void {
    this.pasatiempos.push(this.fb.control(''));
  }

  borrarPasatiempo(i: number): void {
    this.pasatiempos.removeAt(i);
  }

  guardar(): void {
    console.log(this.forma);

    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) =>
            control.markAllAsTouched()
          );
        } else {
          control.markAllAsTouched();
        }
      });
    }

    // posteo de informacion---- es llamar un servicio para guardar la info en una bd

    // despues del posteo se deben reiniciar los datos
    /* dentro de el reset() va un objeto con los valores que se quieran resetear
    en caso de que no se quieran resetear todos */

    this.forma.reset();
  }
}
