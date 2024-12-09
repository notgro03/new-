import Swal from 'sweetalert2';

export function showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: message,
    timer: 2000,
    showConfirmButton: false
  });
}

export function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message
  });
}

export function showConfirm(message) {
  return Swal.fire({
    icon: 'warning',
    title: '¿Estás seguro?',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  });
}

export function showLoading() {
  Swal.showLoading();
}

export function hideLoading() {
  Swal.close();
}