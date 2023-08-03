Rails.application.routes.draw do
  root to: 'pages#mixage'
  get 'mixage', to: 'pages#mixage'
end
