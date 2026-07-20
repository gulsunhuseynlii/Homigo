using AutoMapper;
using Homigo.API.DTOs.Address;
using Homigo.API.DTOs.Category;
using Homigo.API.DTOs.Favorite;
using Homigo.API.DTOs.Order;
using Homigo.API.DTOs.Payment;
using Homigo.API.DTOs.Provider;
using Homigo.API.DTOs.Review;
using Homigo.API.DTOs.Service;
using Homigo.API.Entities;

namespace Homigo.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Category, CategoryDto>();

        CreateMap<Service, ServiceDto>()
            .ForMember(x => x.CategoryName,
                opt => opt.MapFrom(x => x.Category.Name));

        CreateMap<Address, AddressDto>();

        CreateMap<ProviderProfile, ProviderDto>()
            .ForMember(x => x.FullName,
                opt => opt.MapFrom(x => x.User.FullName))
            .ForMember(x => x.Email,
                opt => opt.MapFrom(x => x.User.Email));

        CreateMap<Order, OrderDto>()
            .ForMember(x => x.ServiceName,
                opt => opt.MapFrom(x => x.Service.Name))
            .ForMember(x => x.AddressTitle,
                opt => opt.MapFrom(x => x.Address.Title))
            .ForMember(x => x.ProviderName,
                opt => opt.MapFrom(x =>
                    x.Provider == null ? null : x.Provider.FullName))
            .ForMember(x => x.Status,
                opt => opt.MapFrom(x => x.Status.ToString()));

        CreateMap<Payment, PaymentDto>();

        CreateMap<Review, ReviewDto>()
            .ForMember(x => x.CustomerName,
                opt => opt.MapFrom(x => x.Customer.FullName));

        CreateMap<Favorite, FavoriteDto>()
            .ForMember(x => x.ServiceName,
                opt => opt.MapFrom(x => x.Service.Name))
            .ForMember(x => x.BasePrice,
                opt => opt.MapFrom(x => x.Service.BasePrice))
            .ForMember(x => x.CategoryName,
                opt => opt.MapFrom(x => x.Service.Category.Name));
    }
}