<template>
  <BForm @submit.prevent="submitForm">
    <BRow>
      <BCol md="6">
        <BFormGroup 
          label="Nome da Escola" 
          label-for="school-name"
          :state="!errors.school_name"
          :invalid-feedback="errors.school_name"
        >
          <BFormInput
            id="school-name"
            v-model="form.school_name"
            type="text"
            placeholder="Digite o nome da escola"
            :state="!errors.school_name"
            @blur="validateField('school_name')"
          />
        </BFormGroup>
      </BCol>
      <BCol md="6">
        <BFormGroup 
          label="Código da Escola" 
          label-for="school-code"
          :state="!errors.school_code"
          :invalid-feedback="errors.school_code"
        >
          <BFormInput
            id="school-code"
            v-model="form.school_code"
            type="text"
            placeholder="Digite o código da escola"
            :state="!errors.school_code"
            @blur="validateField('school_code')"
          />
        </BFormGroup>
      </BCol>
    </BRow>

    <BRow>
      <BCol md="6">
        <BFormGroup 
          label="Município" 
          label-for="municipality"
          :state="!errors.municipality"
          :invalid-feedback="errors.municipality"
        >
          <BFormInput
            id="municipality"
            v-model="form.municipality"
            type="text"
            placeholder="Digite o município"
            :state="!errors.municipality"
            @blur="validateField('municipality')"
          />
        </BFormGroup>
      </BCol>
      <BCol md="6">
        <BFormGroup 
          label="Diretoria de Ensino" 
          label-for="directorate"
          :state="!errors.teaching_directorate"
          :invalid-feedback="errors.teaching_directorate"
        >
          <BFormInput
            id="directorate"
            v-model="form.teaching_directorate"
            type="text"
            placeholder="Digite a diretoria de ensino"
            :state="!errors.teaching_directorate"
            @blur="validateField('teaching_directorate')"
          />
        </BFormGroup>
      </BCol>
    </BRow>

    <BRow>
      <BCol md="6">
        <BFormGroup 
          label="Total de Salas de Aula" 
          label-for="classrooms"
          :state="!errors.total_classrooms"
          :invalid-feedback="errors.total_classrooms"
        >
          <BFormInput
            id="classrooms"
            v-model="form.total_classrooms"
            type="number"
            min="0"
            placeholder="Digite o número de salas"
            :state="!errors.total_classrooms"
            @blur="validateField('total_classrooms')"
          />
        </BFormGroup>
      </BCol>
      <BCol md="6">
        <BFormGroup label="Recursos">
          <BFormCheckbox
            v-model="form.cafeteria"
            value="true"
            unchecked-value="false"
          >
            Possui Refeitório
          </BFormCheckbox>
        </BFormGroup>
      </BCol>
    </BRow>

    <div class="d-flex justify-content-end gap-2 mt-4">
      <BButton 
        variant="outline-secondary" 
        @click="cancel"
        :disabled="loading"
      >
        Cancelar
      </BButton>
      <BButton 
        type="submit" 
        variant="primary"
        :disabled="loading"
      >
        <BSpinner v-if="loading" small class="me-2"></BSpinner>
        {{ loading ? 'Salvando...' : submitText }}
      </BButton>
    </div>
  </BForm>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

// Props
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      school_name: '',
      school_code: '',
      municipality: '',
      teaching_directorate: '',
      total_classrooms: '',
      cafeteria: false
    })
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: 'Salvar'
  }
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Form state
const form = reactive({
  school_name: '',
  school_code: '',
  municipality: '',
  teaching_directorate: '',
  total_classrooms: '',
  cafeteria: false
})

const errors = reactive({})

// Watch for initial data changes
watch(() => props.initialData, (newData) => {
  Object.assign(form, newData)
}, { immediate: true, deep: true })

// Validação de campo individual
const validateField = (fieldName) => {
  delete errors[fieldName]
  
  switch (fieldName) {
    case 'school_name':
      if (!form.school_name.trim()) {
        errors.school_name = 'Nome da escola é obrigatório'
      }
      break
      
    case 'school_code':
      if (!form.school_code.trim()) {
        errors.school_code = 'Código da escola é obrigatório'
      }
      break
      
    case 'municipality':
      if (!form.municipality.trim()) {
        errors.municipality = 'Município é obrigatório'
      }
      break
      
    case 'teaching_directorate':
      if (!form.teaching_directorate.trim()) {
        errors.teaching_directorate = 'Diretoria de ensino é obrigatória'
      }
      break
      
    case 'total_classrooms':
      if (!form.total_classrooms || form.total_classrooms < 0) {
        errors.total_classrooms = 'Total de salas deve ser um número válido'
      }
      break
  }
}

// Validação completa do formulário
const validateForm = () => {
  validateField('school_name')
  validateField('school_code')
  validateField('municipality')
  validateField('teaching_directorate')
  validateField('total_classrooms')
  
  return Object.keys(errors).length === 0
}

// Submit form
const submitForm = () => {
  if (!validateForm()) return
  
  const formData = {
    ...form,
    total_classrooms: parseInt(form.total_classrooms)
  }
  
  emit('submit', formData)
}

// Cancel
const cancel = () => {
  emit('cancel')
}

// Expose form data and errors for parent component
defineExpose({
  form,
  errors,
  validateForm
})
</script>

<style scoped>
</style> 