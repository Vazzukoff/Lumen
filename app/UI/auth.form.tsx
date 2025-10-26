import Link from 'next/link';
import { AuthFormProps } from '../models/prop.models';
import { FaCheck } from "react-icons/fa";
import { MdError } from "react-icons/md";

export default function AuthForm({
  title,
  buttonText,
  footerText,
  footerLinkText,
  footerLinkTo,
  formData,
  fieldErrors,
  error,
  success,
  handleChange,
  handleSubmit,
  isRegister = false,
}: AuthFormProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-900 tracking-tight">{title}</h2>
          <div className="mt-2 w-16 h-0.5 bg-gray-200 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Campo Nombre - Solo en registro */}
          {isRegister && (
            <div>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder=" "
                  className={`w-full px-4 py-3 text-sm border-b focus:border-b-2 bg-transparent focus:outline-none peer ${
                    fieldErrors.name
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-300 focus:border-gray-800'
                  }`}
                  required
                />
                <label
                  htmlFor="name"
                  className={`absolute left-0 top-0 px-4 py-3 text-sm transition-all duration-200 transform pointer-events-none
                    ${formData.name
                      ? '-translate-y-4 text-xs text-gray-600'
                      : 'peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:text-gray-600 text-gray-500'
                    }`}
                >
                  Nombre completo
                </label>
              </div>
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fieldErrors.name}
                </p>
              )}
            </div>
          )}

          {/* Campo Email */}
          <div>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder=" "
                className={`w-full px-4 py-3 text-sm border-b focus:border-b-2 bg-transparent focus:outline-none peer ${
                  fieldErrors.email
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 focus:border-gray-800'
                }`}
                required
              />
              <label
                htmlFor="email"
                className={`absolute left-0 top-0 px-4 py-3 text-sm transition-all duration-200 transform pointer-events-none
                  ${formData.email
                    ? '-translate-y-4 text-xs text-gray-600'
                    : 'peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:text-gray-600 text-gray-500'
                  }`}
              >
                Correo electrónico
              </label>
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Campo Password */}
          <div>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                placeholder=" "
                className={`w-full px-4 py-3 text-sm border-b focus:border-b-2 bg-transparent focus:outline-none peer ${
                  fieldErrors.password
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 focus:border-gray-800'
                }`}
                required
              />
              <label
                htmlFor="password"
                className={`absolute left-0 top-0 px-4 py-3 text-sm transition-all duration-200 transform pointer-events-none
                  ${formData.password
                    ? '-translate-y-4 text-xs text-gray-600'
                    : 'peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:text-gray-600 text-gray-500'
                  }`}
              >
                Contraseña
              </label>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Campo Edad - Solo en registro */}
          {isRegister && (
            <div>
              <div className="relative">
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  placeholder=" "
                  min="10"
                  max="100"
                  className={`w-full px-4 py-3 text-sm border-b focus:border-b-2 bg-transparent focus:outline-none peer ${
                    fieldErrors.age
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-300 focus:border-gray-800'
                  }`}
                />
                <label
                  htmlFor="age"
                  className={`absolute left-0 top-0 px-4 py-3 text-sm transition-all duration-200 transform pointer-events-none
                    ${formData.age
                      ? '-translate-y-4 text-xs text-gray-600'
                      : 'peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:text-gray-600 text-gray-500'
                    }`}
                >
                  Edad (opcional)
                </label>
              </div>
              {fieldErrors.age && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fieldErrors.age}
                </p>
              )}
            </div>
          )}

          {/* Campo Género - Solo en registro */}
          {isRegister && (
            <div>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm border-b focus:border-b-2 bg-transparent focus:outline-none appearance-none cursor-pointer ${
                    fieldErrors.gender
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-300 focus:border-gray-800'
                  } ${!formData.gender ? 'text-gray-500' : 'text-gray-900'}`}
                >
                  <option value="">Selecciona tu género (opcional)</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero_no_decir">Prefiero no decir</option>
                </select>
                <label
                  htmlFor="gender"
                  className={`absolute left-0 top-0 px-4 text-sm transition-all duration-200 pointer-events-none ${
                    formData.gender 
                      ? '-translate-y-4 text-xs text-gray-600' 
                      : 'translate-y-3 text-gray-500'
                  }`}
                >
                  {formData.gender ? 'Género' : ''}
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {fieldErrors.gender && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fieldErrors.gender}
                </p>
              )}
            </div>
          )}

          {/* Campo País - Solo en registro */}
          {isRegister && (
            <div>
              <div className="relative">
                <select
                  id="country"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm border-b focus:border-b-2 bg-transparent focus:outline-none appearance-none cursor-pointer ${
                    fieldErrors.country
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-300 focus:border-gray-800'
                  } ${!formData.country ? 'text-gray-500' : 'text-gray-900'}`}
                >
                  <option value="">Selecciona tu país (opcional)</option>
                  <option value="argentina">Argentina</option>
                  <option value="bolivia">Bolivia</option>
                  <option value="chile">Chile</option>
                  <option value="colombia">Colombia</option>
                  <option value="costa_rica">Costa Rica</option>
                  <option value="cuba">Cuba</option>
                  <option value="ecuador">Ecuador</option>
                  <option value="el_salvador">El Salvador</option>
                  <option value="espana">España</option>
                  <option value="guatemala">Guatemala</option>
                  <option value="honduras">Honduras</option>
                  <option value="mexico">México</option>
                  <option value="nicaragua">Nicaragua</option>
                  <option value="panama">Panamá</option>
                  <option value="paraguay">Paraguay</option>
                  <option value="peru">Perú</option>
                  <option value="puerto_rico">Puerto Rico</option>
                  <option value="republica_dominicana">República Dominicana</option>
                  <option value="uruguay">Uruguay</option>
                  <option value="venezuela">Venezuela</option>
                  <option value="otro">Otro</option>
                </select>
                <label
                  htmlFor="country"
                  className={`absolute left-0 top-0 px-4 text-sm transition-all duration-200 pointer-events-none ${
                    formData.country 
                      ? '-translate-y-4 text-xs text-gray-600' 
                      : 'translate-y-3 text-gray-500'
                  }`}
                >
                  {formData.country ? 'País' : ''}
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {fieldErrors.country && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fieldErrors.country}
                </p>
              )}
            </div>
          )}

          {/* Mensajes de error/éxito */}
          <div className="h-10 transition-all duration-300">
            {error && (
              <div className="text-red-500 text-xs py-2 px-4 bg-red-50 rounded-lg flex items-center">
                <MdError className="mr-1 text-base" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="text-green-600 text-xs py-2 px-4 bg-green-50 rounded-lg flex items-center">
                <FaCheck className="mr-1" />
                <span>{success}</span>
              </div>
            )}
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="w-full py-3.5 text-sm font-medium border-2 border-black text-white bg-gray-900 rounded-lg transition-all duration-200 hover:bg-white hover:text-black hover:-translate-y-[1px] focus:outline-none"
          >
            {buttonText}
          </button>

          {/* Footer con link */}
          <p className="text-xs text-center text-gray-500 pt-3">
            {footerText}{' '}
            <Link href={footerLinkTo} className="text-gray-700 hover:text-gray-900 font-medium underline underline-offset-2">
              {footerLinkText}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}